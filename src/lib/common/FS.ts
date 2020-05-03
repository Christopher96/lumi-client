import * as Diff from 'diff';
import readFileGo from 'readfile-go';

import { IPatch, FileEvent } from './types';
import * as path from 'path';
import zipper from 'zip-local';
import chokidar, { FSWatcher, WatchOptions } from 'chokidar';
import { readFile, mkdirSync } from 'fs';
import fse from 'fs-extra';
export type FileSystemChangeType = { buffer: Buffer; path: string; event: FileEvent };
export type SubscribeToChangeCallback = (input: IPatch) => void;
export type SubscribeToCreateCallback = (input: IPatch) => void;

export class FS {
  private static readonly watchOptions: WatchOptions = {
    // This will ignore dotfiles for example .shadow (we need to add support for also ignoring binary files, images and so on).
    ignored: /(^|[\/\\])\../,
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

  static applyPatchs(iPatch: IPatch) {
    console.log(iPatch);
    console.log('Applying patch');
    return new Promise((resolve, reject) => {
      // For each specific file patch in the patch
      iPatch.diffs.forEach(patch => {
        const filePath = patch.oldFileName;
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
    const shadowFile = path.join(sourceFolderPath, shadowFolderPath, filePath);
    const sourceFile = path.join(sourceFolderPath, filePath);
    const shadowData = readFileGo(shadowFile);
    const sourceData = readFileGo(sourceFile);

    const patchData = Diff.createTwoFilesPatch(shadowFile, sourceFile, shadowData, sourceData);

    return Diff.parsePatch(patchData);
  }

  static subscribeToChange(source: string, callback: SubscribeToChangeCallback) {
    const watcher = chokidar.watch(source, FS.watchOptions);
    watcher.on('change', filePath => {
      const absoluteShadowPath = this.SHADOW_RELATIVE_PATH;
      const relativeFilePath = path.relative(source, filePath);
      const diffs = this.getDiff(source, absoluteShadowPath, relativeFilePath);
      callback({ diffs, event: FileEvent.FILE_MODIFIED });
    });
  }

  static subscribeToCreate(source: string, callback: SubscribeToCreateCallback, events?: FileEvent[]) {
    // Checks if the users subscribes to changes. this is not allowed.
    if (events && events.includes(FileEvent.FILE_MODIFIED)) {
      throw new Error('This method should not be used for checking how a file changes. Use subscribeToChange instead');
    }

    const watcher = chokidar.watch(source, FS.watchOptions);
    watcher.on('all', (event, filePath) => {
      // Checks that the event is one the select ones.
      if (event == 'change') return;
      if (events && !events.includes(event as FileEvent)) return;
      if (event === 'unlink' || event === 'unlinkDir') {
        callback({ buffer: null, path: filePath, event: event as FileEvent });
        return;
      }

      readFile(filePath, (err, buffer) => {
        if (err) throw err;
        else callback({ buffer, path: filePath, event: event as FileEvent });
      });
    });
  }

  static handleEvent(event: IPatch) {
    switch (event.event) {
      case FileEvent.DIR_CREATED: {
        const filePath = path.join(FS.SHADOW_RELATIVE_PATH, event.path);
        fse.ensureDirSync(path.dirname(filePath));
        return;
      }

      case FileEvent.FILE_DELETED: {
        fse.writeFile(path.join(FS.SHADOW_RELATIVE_PATH, event.path), event.buffer);
        return;
      }

      case FileEvent.FILE_CREATED: {
        const filePath = path.join(path.dirname(event.path), FS.SHADOW_RELATIVE_PATH, path.basename(event.path));
        console.log('event:', event.event, ':<>', filePath);
        fse.ensureDirSync(path.dirname(filePath));
        fse.writeFile(filePath, event.buffer);
        return;
      }

      case FileEvent.DIR_CREATED: {
        const dirName = path.join(FS.SHADOW_RELATIVE_PATH, event.path);
        fse.ensureDirSync(dirName);
        return;
      }

      case FileEvent.FILE_MODIFIED: {
        FS.applyPatchs(event);
        return;
      }
    }
  }

  static createShadow(folderPath: string, buffer: Buffer) {
    const shadowPath = path.join(folderPath, FS.SHADOW_RELATIVE_PATH);
    fse.ensureDirSync(shadowPath);
    return FS.unzip(shadowPath, buffer);
  }
}
