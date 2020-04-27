import { FileEventType } from './fileEventType';
import { SourceFolderWatcher } from './sourceFolderWatcher';
import fs from 'fs';
import Socket from '../socket';
import events from '../common/events';
import { IFileChange, IRoom } from '../common/interfaces';

/**
 * The SourceFolderHandler class uses the sourceFolderWatcher to receive file and folder updates and then
 * transmitts them to the
 * @author Michael Arenander peer: Marcus Alevärn
 * @date 2020-04-22
 */

export class SourceFolderHandler {
  // local SourceFolderWatcher-object that will listen to file changes.
  private sourceFolderWatcher;

  // The current room.
  private room: IRoom;

  /**
   * This constructor should be called once per connection and should run until connection closes.
   * @param sourceFolderPath
   */
  constructor(sourceFolderPath: string, room: IRoom) {
    console.log('Source Folder Handler has been constructed with param: ' + sourceFolderPath);

    // setting the local variable sourceFolderWatcher to a SourceFolderWatcher-object.
    this.sourceFolderWatcher = new SourceFolderWatcher(sourceFolderPath);

    this.room = room;

    this.listenForChangesInSourceFolder();
  }

  private listenForChangesInSourceFolder() {
    // starting to listen to any file changes from the sourceFolderWatcher.
    this.sourceFolderWatcher.onFileChange((event: FileEventType, relativePath: string) => {
      if (event == FileEventType.FILE_CREATED) {
        fs.readFile(relativePath, (err: NodeJS.ErrnoException, data: Buffer) => {
          if (err) throw err;

          console.log(
            'Should send file ' + event + '-operation to the server with path=' + relativePath + ' and content=' + data
          );

          const fileChange: IFileChange = {
            event,
            relativePath,
            room: this.room,
            data
          };

          console.log(`Sent ${event}, ${relativePath} to server.`);
          
          // Send the file change to the server!
          Socket.get().emit(events.FILE_CHANGE, fileChange);
        });
      } else if (event == FileEventType.FILE_MODIFIED) {
        // Patches can be implemented here!
      } else {
        const fileChange: IFileChange = {
          event,
          relativePath,
          room: this.room
        };
        
        console.log(`Sent ${event}, ${relativePath} to server.`);
        
        Socket.get().emit(events.FILE_CHANGE, fileChange);
      }
    });
  }
}
