import * as Diff from 'diff';
import { IPatch, FileEvent, IFileChange } from './types';
import * as path from 'path';
import zipper from 'zip-local';
import chokidar, { WatchOptions } from 'chokidar';
import { readFile } from 'fs';
import fse from 'fs-extra';

/**
 * This class contains static methods for manipulating files.
 * In addition support for watching file changes.
 */
export class FS {
  // These options are used when we initialize the directory watcher.
  private static readonly watchOptions: WatchOptions = {
    // This will ignore dotfiles for example .shadow (we need to add support for also ignoring binary files, images and so on).
    ignored: /(^|[\/\\])\../,
    // Indicates whether the process should continue to run as long as files are being watched.
    persistent: true,
    // When we begin to watch the source folder we can make sure that already existing files do not trigger a file change event.
    ignoreInitial: true
  };

  static readonly SHADOW_RELATIVE_PATH = '.shadow';

  /**
   * Takes in some compressed zip data and unzips it.
   * @param buffer the data we want to unzip.
   */
  protected static unzipBuffer(buffer: Buffer): Promise<any> {
    return new Promise((res, rej) => zipper.unzip(buffer, (error, data) => (error ? rej(error) : res(data))));
  }

  /**
   * Will save the zip file.
   * @param unzipped the unzipped object.
   * @param savePath where we should save the data.
   */
  protected static saveBuffer(unzipped: any, savePath: string): Promise<void> {
    return new Promise<void>((res, rej) => unzipped.save(savePath, error => (error ? rej(error) : res())));
  }

  /**
   * This will unzip the data and save it.
   * @param savePath where we should unzip and save the data.
   * @param buffer the zip data.
   */
  static async unzip(savePath: string, buffer: Buffer): Promise<void> {
    await fse.ensureDir(savePath);
    const unzipped = await FS.unzipBuffer(buffer);
    await FS.saveBuffer(unzipped, savePath);
  }

  /**
   * This will zip a directory and return it as binary data.
   * @param path the path to the directory we want to zip.
   */
  static zip(path: string): Promise<Buffer> {
    return new Promise((res, rej) =>
      zipper.zip(path, (err, zipped) => (err ? rej(err) : res(zipped.compress().memory())))
    );
  }

  /**
   * This method will apply a file patch in the shadow folder.
   * @param source the source folder path.
   * @param iPatch the file patch we want to apply in the shadow folder (this comes from the server).
   */
  static applyPatches(source: string, iPatch: IPatch): Promise<void[]> {
    // For each specific file patch in the patch
    return Promise.all(
      iPatch.diffs.map(patch => {
        return new Promise<void>((resolve, reject) => {
          // We split on any delimter and use the join function to
          // make sure that the delimiter which is used is the correct
          // for the OS.
          const osSafeFilePath = path.join(source, FS.SHADOW_RELATIVE_PATH, ...iPatch.path.split(/\/|\\/g));
          fse.readFile(osSafeFilePath).then(buffer => {
            const appliedData = Diff.applyPatch(buffer.toString(), patch);

            // Check wheter the patch is valid or not
            if (appliedData === 'false') reject('could not apply patch.');

            fse.writeFile(osSafeFilePath, appliedData, err => {
              if (err) reject('could not write to file.');
              else resolve();
            });
          });
        });
      })
    );
  }

  /**
   * This method will compare two files and return the difference.
   * @param sourceFolderPath the source folder path.
   * @param filePath the path to the file that we want to use in the comparison.
   */
  static async getDiff(source: string, filePath: string): Promise<Diff.ParsedDiff[]> {
    const shadowFile = path.join(source, FS.SHADOW_RELATIVE_PATH, filePath);
    const sourceFile = path.join(source, filePath);
    const shadowData = (await fse.readFile(shadowFile)).toString();
    const sourceData = (await fse.readFile(sourceFile)).toString();

    const patchData = Diff.createTwoFilesPatch(shadowFile, sourceFile, shadowData, sourceData);

    return Diff.parsePatch(patchData);
  }

  /**
   * By calling this method you will begin to listen for FILE_MODIFIED in the source folder directory.
   * @param source the source folder path.
   * @param onPatch a callback function that will be called upon a file patch.
   */
  static listenForLocalPatches(source: string, onPatch: (patch: IPatch) => void) {
    const watcher = chokidar.watch(source, FS.watchOptions);
    watcher.on('change', async filePath => {
      const relativeFilePath = path.relative(source, filePath);
      const diffs = await FS.getDiff(source, relativeFilePath);
      onPatch({ path: relativeFilePath, diffs, event: FileEvent.FILE_MODIFIED });
    });
  }

  /**
   * By calling this method you will begin to listen for FILE_CREATED, FILE_DELETED, DIR_CREATED and DIR_DELETED in the source folder directory.
   * @param source the source folder path.
   * @param onFileChange a callback function that will be called upon a file change.
   */
  static listenForLocalFileChanges(source: string, onFileChange: (fileChange: IFileChange) => void) {
    const watcher = chokidar.watch(source, FS.watchOptions);
    watcher.on('all', (event, filePath) => {
      // This event is handled by patches.
      if (event == 'change') return;

      // We don't want the source folder to be visible in the path.
      // For example the file path: source-folder/dog.cpp, we just want to send /dog.cpp to the server.
      const relativeFilePath = path.relative(source, filePath);

      // These events do not require us to read any file data.
      if (event === 'addDir' || event === 'unlink' || event === 'unlinkDir') {
        onFileChange({ path: relativeFilePath, event: event as FileEvent });
      } else {
        // This code will be run for the FILE_CREATED event.
        readFile(filePath, (err, buffer) => {
          if (err) throw err;
          else onFileChange({ buffer, path: relativeFilePath, event: event as FileEvent });
        });
      }
    });
  }

  /**
   * This code will apply a file change in the shadow folder.
   * @param source the source folder path.
   * @param fileChange the file change we want to apply in the shadow folder (this comes from the server).
   */
  static async applyFileChange(source: string, fileChange: IFileChange): Promise<void> {
    const osSafeFilePath = path.join(source, FS.SHADOW_RELATIVE_PATH, ...fileChange.path.split(/\/|\\/g));

    switch (fileChange.event) {
      case FileEvent.FILE_DELETED: {
        return fse.remove(osSafeFilePath);
      }

      case FileEvent.FILE_CREATED: {
        await fse.ensureDir(path.dirname(osSafeFilePath));
        return fse.writeFile(osSafeFilePath, fileChange.buffer);
      }

      case FileEvent.DIR_CREATED: {
        return fse.ensureDir(osSafeFilePath);
      }

      case FileEvent.DIR_DELETED: {
        return fse.remove(osSafeFilePath);
      }
    }

    throw new Error('Did not return in applyFileChange');
  }

  /**
   * This method will create a new shadow folder and unzip a buffer into it.
   * @param source the source folder path.
   * @param buffer this is zip data (comes from the server).
   */
  static async createShadow(source: string, buffer: Buffer): Promise<void> {
    const shadowPath = path.join(source, FS.SHADOW_RELATIVE_PATH);
    await fse.emptyDir(shadowPath);
    return FS.unzip(shadowPath, buffer);
  }
}
