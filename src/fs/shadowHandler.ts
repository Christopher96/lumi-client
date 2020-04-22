import fs from 'fs-extra';
import { FileEventType } from './fileEventType';
import path from 'path';

/**
 * The ShadowHandler class is used for handling file operations such as creating, removing and moving files and folders.
 * The ShadowHandler is used for executing the file/folder changes that were received from the server.
 * @author Michael Arenander peer: Marcus Alevärn
 * @date 2020-04-22
 */

export class ShadowHandler {
  // local string where the directory of the client's shadow folder shall be stored.
  private shadowFolder: string;

  /**
   * This constructor should be called once per connection and should run until connection closes.
   * @param sourceFolder path to the root folder that shall be synced and shadowed.
   */
  constructor(sourceFolder: string) {
    console.log('Shadow Handler has been constructed with param: ' + sourceFolder);

    // setting the local variable shadowFolder to the directory of the shadow folder
    this.shadowFolder = path.join(sourceFolder, '.shadow');

    // creating the shadow folder at the shadowFolder directory.
    fs.ensureDirSync(this.shadowFolder);
  }

  /**
   * The update method should be called when a file change has been received from the server.
   * This file change then results in the coresponding modification of the source folder.
   * @param event
   * @param path example: 'src/index.ts'
   */
  public update(event: FileEventType, relativePath: string, fileContent?: string): void {
    const operationPath = path.join(this.shadowFolder, relativePath);

    // runs the appropriate file operation that was sent from the server and received to this client.
    switch (event) {
      case FileEventType.FILE_CREATED:
      case FileEventType.FILE_MODIFIED:
        fs.writeFileSync(operationPath, fileContent);
        break;
      case FileEventType.DIR_CREATED:
        fs.ensureDirSync(operationPath);
        break;
      case FileEventType.FILE_DELETED:
      case FileEventType.DIR_DELETED:
        fs.removeSync(operationPath);
        break;
      default:
        console.error('Error!');
        break;
    }
  }

  /**
   * The getShadowFolder method returns the directory path to the shadow folder.
   */
  public getShadowFolder(): string {
    return this.shadowFolder;
  }
}
