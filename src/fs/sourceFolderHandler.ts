import { FileEventType } from './fileEventType';
import { SourceFolderWatcher } from './sourceFolderWatcher';
import fs from 'fs';
import Socket from '@src/socket';
import events from '@common/events';
import { IFileChange, FileChange, IRoom, IPatch } from '@common/interfaces';
import { patchCreate } from '@src/common/patch';

/**
 * The SourceFolderHandler class uses the sourceFolderWatcher to receive file and folder updates and then
 * transmitts them to the
 * @author Michael Arenander peer: Marcus Alevärn
 * @date 2020-04-22
 */

export class SourceFolderHandler {
  // local SourceFolderWatcher-object that will listen to file changes.
  private sourceFolderWatcher: SourceFolderWatcher;

  private shadowFolderPath: string;
  private sourceFolderPath: string;

  // The current room.
  private room: IRoom;

  /**
   * This constructor should be called once per connection and should run until connection closes.
   * @param sourceFolderPath
   */
  constructor(room: IRoom) {
    // const sourceFolderPath = room.sourceFolderPath;
    // console.log('Source Folder Handler has been constructed with param: ' + sourceFolderPath);
    // // setting the local variable sourceFolderWatcher to a SourceFolderWatcher-object.
    // this.sourceFolderWatcher = new SourceFolderWatcher(sourceFolderPath);

    // setting the local variable sourceFolderWatcher to a SourceFolderWatcher-object.
    this.sourceFolderPath = room.sourceFolderPath;
    this.shadowFolderPath = room.shadowFolderPath;
    this.sourceFolderWatcher = new SourceFolderWatcher(room.sourceFolderPath);

    this.room = room;

    this.listenForChangesInSourceFolder();
  }

  private listenForChangesInSourceFolder() {
    // starting to listen to any file changes from the sourceFolderWatcher.
    this.sourceFolderWatcher.onFileChange((event: FileEventType, relativePath: string) => {
      // in case of modified file, we use patches. Here is the constuction of an iPatch data object:
      if (event == FileEventType.FILE_MODIFIED) {
        const diffs = patchCreate(this.shadowFolderPath, this.sourceFolderPath, relativePath);
        const iPatch: IPatch = {
          room: this.room,
          diffs
        };

        Socket.get().emit(events.FILE_PATCH, iPatch);
      } else {
        // in case of a file update that does not involve patches, we use a FileChange data object:
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
        } else {
          console.log(`Sent ${event}, ${relativePath} to server.`);
        }

        const ifileChange: IFileChange = {
          room: this.room,
          fileChange
        };

        Socket.get().emit(events.FILE_CHANGE, ifileChange);
      }
    });
  }
}
