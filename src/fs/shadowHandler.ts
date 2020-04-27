import fs from 'fs-extra';
import { FileEventType } from './fileEventType';
import path from 'path';
import events from '../common/events';
import Socket from '../socket';
import { IRoom, FileChange } from '../common/interfaces';
import FileUpdate from './fileUpdate';

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

    // removes old shadow files.
    fs.removeSync(this.shadowFolder);

    // creating the shadow folder at the shadowFolder directory.
    fs.ensureDirSync(this.shadowFolder);
  }

  /**
   * The update method should be called when a file change has been received from the server.
   * This file change then results in the coresponding modification of the source folder.
   */
  public update(fileChange: FileChange): Promise<void> {
    return FileUpdate.update(this.shadowFolder, fileChange);
  }

  /**
   * The getShadowFolder method returns the directory path to the shadow folder.
   */
  public getShadowFolder(): string {
    return this.shadowFolder;
  }
}
