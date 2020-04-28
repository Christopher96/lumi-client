import chokidar, { FSWatcher, WatchOptions } from 'chokidar';
import fs from 'fs-extra';
import path from 'path';
import { FileEvent } from './fileEvent';

export class SourceDirectoryWatcher {
  private sourceDirectoryPath: string;

  private watcher: FSWatcher;

  private static readonly watchOptions: WatchOptions = {
    // This will ignore dotfiles for example .shadow (we need to add support for also ignoring binary files, images and so on).
    ignored: /(^|[\/\\])\../,
    // Indicates whether the process should continue to run as long as files are being watched.
    persistent: true,
    // When we begin to watch the source folder we can make sure that already existing files do not trigger a file change event.
    ignoreInitial: true
  };

  constructor(sourceDirectoryPath: string) {
    this.sourceDirectoryPath = sourceDirectoryPath;
    this.watcher = chokidar.watch(this.sourceDirectoryPath, SourceDirectoryWatcher.watchOptions);
  }

  public onFileChange(listener: (fileEventType: FileEvent, filename: string, fileData?: Buffer) => void): void {
    this.watcher.on('all', (event: string, filename: string) => {
      if (event === 'add' || event === 'change') {
        fs.readFile(filename, (err, data: Buffer) => {
          if (err) {
            throw err;
          } else {
            listener(event as FileEvent, path.relative(this.sourceDirectoryPath, filename), data);
          }
        });
      } else {
        listener(event as FileEvent, path.relative(this.sourceDirectoryPath, filename));
      }
    });
  }
}
