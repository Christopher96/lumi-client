import { FileEventType } from './fileEventType';
import { SourceFolderWatcher } from './sourceFolderWatcher';
import fs from 'fs';
/**
 * The FileSystem functions are used for handling file operations such as creating, removing and moving files and folders.
 * @author: Michael Arenander
 * Written: 2020-04-21
 */

export class SourceFolderHandler {
  private sourceFolderWatcher;

  constructor(sourceFolderPath: string) {
    console.log('Source Folder Handler');
    this.sourceFolderWatcher = new SourceFolderWatcher(sourceFolderPath);
    this.sourceFolderWatcher.onFileChange((event: FileEventType, path: string) => {
      if (event == FileEventType.FILE_CREATED || event == FileEventType.FILE_MODIFIED) {
        const content = fs.readFileSync(path).toString(); //content
        // TODO: send event, path and content to server
      } else {
        // TODO: send event and path to server
      }
    });
  }
}
