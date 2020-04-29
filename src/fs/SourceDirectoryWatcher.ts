import chokidar, { FSWatcher, WatchOptions } from 'chokidar';
import fs from 'fs-extra';
import path from 'path';
import { FileEvent } from './fileEvent';

export default class SourceDirectoryWatcher {

  private watcher: FSWatcher;

  private static readonly watchOptions: WatchOptions = {
    // This will ignore dotfiles for example .shadow (we need to add support for also ignoring binary files, images and so on).
    ignored: /(^|[\/\\])\../,
    // Indicates whether the process should continue to run as long as files are being watched.
    persistent: true,
    // When we begin to watch the source folder we can make sure that already existing files do not trigger a file change event.
    ignoreInitial: true
  };

  public onFileChange(sourceDirectoryPath: string, listener: (fileEventType: FileEvent, filename: string, fileData?: Buffer) => void): void {
    this.watcher = chokidar.watch(sourceDirectoryPath, SourceDirectoryWatcher.watchOptions);
    this.watcher.on('all', (event: string, filename: string) => {
      if (event === 'add' || event === 'change') {
        fs.readFile(filename, (err, data: Buffer) => {
          if (err) {
            throw err;
          } else {
            listener(event as FileEvent, path.relative(sourceDirectoryPath, filename), data);
          }
        });
      } else {
        listener(event as FileEvent, path.relative(sourceDirectoryPath, filename));
      }
    });
  }

  public close(): Promise<void> {
    return this.watcher.close(); 
  }
}
