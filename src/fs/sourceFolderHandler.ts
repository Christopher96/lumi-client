import { FileEventType } from './fileEventType';
import { SourceFolderWatcher } from './sourceFolderWatcher';
import fs from 'fs';
import path from 'path';

/**
 * The SourceFolderHandler class uses the sourceFolderWatcher to receive file and folder updates and then
 * transmitts them to the
 * @author Michael Arenander peer: Marcus Alevärn
 * @date 2020-04-22
 */

export class SourceFolderHandler {
  // local SourceFolderWatcher-object that will listen to file changes.
  private sourceFolderWatcher;

  /**
   *This constructor should be called once per connection and should run until connection closes.
   * @param sourceFolderPath
   */
  constructor(sourceFolderPath: string) {
    console.log('Source Folder Handler has been constructed with param: ' + sourceFolderPath);

    // setting the local variable sourceFolderWatcher to a SourceFolderWatcher-object.
    this.sourceFolderWatcher = new SourceFolderWatcher(sourceFolderPath);

    // starting to listen to any file changes from the sourceFolderWatcher.
    this.sourceFolderWatcher.onFileChange((event: FileEventType, relativePath: string) => {
      if (event == FileEventType.FILE_CREATED || event == FileEventType.FILE_MODIFIED) {
        const content = fs.readFileSync(relativePath).toString(); //content

        console.log(
          'Should send file ' + event + '-operation to the server with path=' + relativePath + ' and content=' + content
        );

        // TODO: send event, path and content to server
      } else {
        console.log('Should send file/folder ' + event + '-operation to the server with path=' + relativePath);
        // TODO: send event and path to server
      }
    });
  }
}

new SourceFolderHandler('test-repo');
