import { FileEventType } from './fileEventType';
import { SourceFolderWatcher } from './sourceFolderWatcher';
import fs from 'fs';
import Socket from '../socket';
import events from '../common/events';
import { IFileChange, FileChange, IRoom } from '../common/interfaces';
import { patchCreate } from '@src/common/patch';

/**
 * The SourceFolderHandler class uses the sourceFolderWatcher to receive file and folder updates and then
 * transmitts them to the
 * @author Michael Arenander peer: Marcus Alevärn
 * @date 2020-04-22
 */

export class SourceFolderHandler {
  // local SourceFolderWatcher-object that will listen to file changes.
  private sourceFolderWatcher;

  private shadowFolderPath: string;
  private sourceFolderPath: string;

  // The current room.
  private room: IRoom;

  /**
   * This constructor should be called once per connection and should run until connection closes.
   * @param sourceFolderPath
   */
  constructor(room: IRoom, shadowFolderPath: string) {
    const sourceFolderPath = room.sourceFolderPath;
    console.log('Source Folder Handler has been constructed with param: ' + sourceFolderPath);

    // setting the local variable sourceFolderWatcher to a SourceFolderWatcher-object.
    this.sourceFolderWatcher = new SourceFolderWatcher(sourceFolderPath);

    this.shadowFolderPath = shadowFolderPath;
    this.sourceFolderPath = sourceFolderPath;

    this.room = room;

    this.listenForChangesInSourceFolder();
  }

  private listenForChangesInSourceFolder() {
    // starting to listen to any file changes from the sourceFolderWatcher.
    this.sourceFolderWatcher.onFileChange((event: FileEventType, relativePath: string) => {
      const fileChange: FileChange = {
        event,
        relativePath
      };

      if (event == FileEventType.FILE_CREATED) {
        fs.readFile(relativePath, (err: NodeJS.ErrnoException, data: Buffer) => {
          if (err) throw err;

          fileChange.data = data;

          console.log(`Sent ${event}, ${relativePath} to server.`);
        });
      } else if (event == FileEventType.FILE_MODIFIED) {
        fileChange.data = patchCreate(this.shadowFolderPath, this.sourceFolderPath, fileChange.relativePath);
      } else {
        console.log(`Sent ${event}, ${relativePath} to server.`);
      }

      const ifileChange: IFileChange = {
        room: this.room,
        fileChange
      };

      Socket.get().emit(events.FILE_CHANGE, ifileChange);
    });
  }
}
