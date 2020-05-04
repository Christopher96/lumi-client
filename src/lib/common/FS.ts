import * as Diff from 'diff';
import readFileGo from 'readfile-go';

import { IPatch, FileEvent, IFileChange } from './types';
import * as path from 'path';
import zipper from 'zip-local';
import chokidar, { FSWatcher, WatchOptions } from 'chokidar';
import { readFile, mkdirSync } from 'fs';
import fse from 'fs-extra';
import { Console } from '../utils/Console';
export type FileSystemChangeType = { buffer: Buffer; path: string; event: FileEvent };
export type SubscribeToChangeCallback = (input: IPatch) => void;
export type SubscribeToCreateCallback = (input: IPatch) => void;

export class FS {
  private static readonly watchOptions: WatchOptions = {
    // This will ignore dotfiles for example .shadow (we need to add support for also ignoring binary files, images and so on).
    ignored: /((^|[\/\\])\..)|(>|<|\?|\/|\\|\'|\*|\"|\|)/,
    // Indicates whether the process should continue to run as long as files are being watched.
    persistent: true,
    // When we begin to watch the source folder we can make sure that already existing files do not trigger a file change event.
    ignoreInitial: true
  };

  static readonly SHADOW_RELATIVE_PATH = '.shadow';

  protected static unzipBuffer(buffer: Buffer): Promise<any> {
    return new Promise((res, rej) => zipper.unzip(buffer, (error, data) => (error ? rej(error) : res(data))));
  }

  static async unzip(savePath: string, buffer: Buffer) {
    await fse.ensureDir(savePath);
    const unzipped = await this.unzipBuffer(buffer);
    await unzipped.save(savePath);
  }

  static zip(path: string): Promise<Buffer> {
    return new Promise((res, rej) =>
      zipper.zip(path, (err, zipped) => (err ? rej(err) : res(zipped.compress().memory())))
    );
  }

  static applyPatchs(sourceFolderPath: string, iPatch: IPatch) {
    return new Promise((resolve, reject) => {
      // For each specific file patch in the patch
      iPatch.diffs.forEach(patch => {
        // We split on any delimter and use the join function to
        // make sure that the delimiter which is used is the correct
        // for the OS.
        const filePath = path.join(...patch.oldFileName.split(/\/|\\/g));
        const oldData = readFileGo(filePath);
        const appliedData = Diff.applyPatch(oldData, patch);

        // Check wheter the patch is valid or not
        if (appliedData === 'false') reject('could not apply patch.');

        fse.writeFile(filePath, appliedData, err => {
          if (err) reject('could not write to file.');
          else resolve();
        });
      });
    });
  }

  static getDiff(sourceFolderPath: string, shadowFolderPath: string, filePath: string) {
    const shadowFile = path.join(shadowFolderPath, filePath);
    const sourceFile = path.join(sourceFolderPath, filePath);
    const shadowData = readFileGo(shadowFile);
    const sourceData = readFileGo(sourceFile);

    const patchData = Diff.createTwoFilesPatch(shadowFile, sourceFile, shadowData, sourceData);

    return Diff.parsePatch(patchData);
  }

  static listenForPatches(source: string, onPatch: (patch: IPatch) => void) {
    const watcher = chokidar.watch(source, FS.watchOptions);
    watcher.on('change', filePath => {
      const absoluteShadowPath = this.SHADOW_RELATIVE_PATH;
      const relativeFilePath = path.relative(source, filePath);
      const diffs = this.getDiff(source, absoluteShadowPath, relativeFilePath);
      onPatch({ path: relativeFilePath, diffs, event: FileEvent.FILE_MODIFIED });
    });
  }

  static listenForFileChanges(source: string, onFileChange: (fileChange: IFileChange) => void) {
    const watcher = chokidar.watch(source, FS.watchOptions);
    watcher.on('all', (event, filePath) => {
      // Checks that the event is one the select ones.
      if (event == 'change') return;

      const relativeFilePath = path.relative(source, filePath);

      if (event === 'addDir' || event === 'unlink' || event === 'unlinkDir') {
        onFileChange({ path: relativeFilePath, event: event as FileEvent });
        return;
      }

      readFile(filePath, (err, buffer) => {
        if (err) throw err;
        else onFileChange({ buffer, path: relativeFilePath, event: event as FileEvent });
      });
    });
  }

  static applyFileChange(sourceFolderPath: string, fileChange: IFileChange) {
    const osSpecific = path.join(...fileChange.path.split(/\/|\\/g));

    switch (fileChange.event) {
      case FileEvent.FILE_DELETED: {
        fse.remove(path.join(sourceFolderPath, FS.SHADOW_RELATIVE_PATH, osSpecific));
        return;
      }

      case FileEvent.FILE_CREATED: {
        const filePath = path.join(sourceFolderPath, FS.SHADOW_RELATIVE_PATH, osSpecific);
        fse.ensureDirSync(path.dirname(filePath));
        fse.writeFile(filePath, fileChange.buffer);
        return;
      }

      case FileEvent.DIR_CREATED: {
        const dirName = path.join(sourceFolderPath, FS.SHADOW_RELATIVE_PATH, osSpecific);
        fse.ensureDirSync(dirName);
        return;
      }

      case FileEvent.DIR_DELETED: {
        const dirName = path.join(sourceFolderPath, FS.SHADOW_RELATIVE_PATH, osSpecific);
        fse.remove(dirName);
        return;
      }
    }
  }

  static createShadow(folderPath: string, buffer: Buffer) {
    const shadowPath = path.join(folderPath, FS.SHADOW_RELATIVE_PATH);
    fse.emptyDirSync(shadowPath);
    return FS.unzip(shadowPath, buffer);
  }
}
