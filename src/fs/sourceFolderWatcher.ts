import chokidar, { FSWatcher, WatchOptions } from 'chokidar';
import { FileEventType } from './fileEventType';
import path from 'path';
import Separator from 'inquirer/lib/objects/separator';

/**
 * This class makes it possible to detect file changes in the source folder.
 * @author Marcus Alevärn
 */
export class SourceFolderWatcher {
  /**
   * The path to the source folder.
   */
  private sourceFolderPath: string;

  /**
   * This object will watch all file changes in the source folder.
   */
  private watcher: FSWatcher;

  /**
   * These options will be used when constructing the FSWatcher object.
   */
  private static readonly watchOptions: WatchOptions = {
    // This will ignore dotfiles for example .shadow (we need to add support for also ignoring binary files, images and so on).
    ignored: /(^|[\/\\])\../,
    // Indicates whether the process should continue to run as long as files are being watched.
    persistent: true,
    // When we begin to watch the source folder we can make sure that already existing files do not trigger a file change event.
    ignoreInitial: true
  };

  /**
   * This will create a new instance of the SourceFolderWatcher class.
   * @param sourceFolderPath The path to the source folder in which we will listen for changes.
   */
  constructor(sourceFolderPath: string) {
    console.log(`SOURCE FOLDER WATCHER: ${sourceFolderPath}`);
    this.sourceFolderPath = sourceFolderPath;
    this.watcher = chokidar.watch(this.sourceFolderPath, SourceFolderWatcher.watchOptions);
  }

  /**
   * Stops watching the source folder.
   */
  public stop(): Promise<void> {
    return this.watcher.close();
  }

  /**
   * Adds an event listener that will be called when the watcher is ready to detect file changes.
   */
  public onReady(listener: () => void): void {
    this.watcher.on('ready', () => listener());
  }

  /**
   * Adds an event listener that will be called if an error occurs.
   * @param listener This listener should take one parameter that describes the error.
   */
  public onError(listener: (error: Error) => void): void {
    this.watcher.on('error', error => listener(error));
  }

  /**
   * Adds an event listener that will be called upon a file change.
   * @param listener This listener should take three parameters,
   *                 the type of the file event,
   *                 the relative path to the file that has been changed
   *                 and lastly one optional parameter for the file size in bytes.
   */
  public onFileChange(listener: (eventType: FileEventType, relativePath: string, fileSize?: number) => void): void {
    this.watcher.on('all', (event, relativePath, stats) => {
      const pathObj = relativePath.split(path.sep);
      pathObj.shift();
      relativePath = path.join(...pathObj);
      if (stats !== undefined) listener(event as FileEventType, relativePath, stats.size);
      else listener(event as FileEventType, relativePath);
    });
  }
}
