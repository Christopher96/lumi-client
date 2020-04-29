import fs from 'fs';
import events from '@common/events';
import { EventHandler, IRoom, IFileChange, IPatch } from '@common/interfaces';
import { UploadEvents } from './upload';
import Socket from '@src/socket';
import { DownloadEvents } from './download';
import { SourceFolderHandler } from '@src/fs/sourceFolderHandler';
import { ShadowFolderHandler } from '@src/fs/shadowFolderHandler';

/**
 * RoomEvents class is used to receive events from the server which it forwards to the handler classes
 * that can execute the desired operations.
 *    Room Events contains:
 *        * ShadowHandler - Used for operating the shadow folder
 *        * SourceFolderHandler - Used for watching and operating the source folder.
 */
export class RoomEvents implements EventHandler {
  private uploadEvents: UploadEvents;
  private shadowFolderHandler: ShadowFolderHandler;
  private sourceFolderHandler: SourceFolderHandler;

  constructor() {
    // Create events for incoming downloads
    new DownloadEvents();
    this.uploadEvents = new UploadEvents();
    this.addEvents();
  }

  /**
   * createRoom should be executed by a user when they want to create a room.
   * @param source // the folder which the room should be built from
   */
  public static createRoom(source: string) {
    console.log('CREATING ROOM');
    if (fs.existsSync(source)) {
      Socket.get().emit(events.CREATE_ROOM, source);
    } else {
      throw new Error('Source does not exist');
    }
  }

  /**
   * Add Events holds the sockets that will be triggered when an event is received from the server.
   * The list of event-types can be found in the
   */
  public static joinRoom(roomID: string) {
    Socket.get().emit(events.JOIN_ROOM, roomID);
  }

  addEvents(): void {
    /**
     * ROOM_CREATED
     * This socket should be activated once the server has created a new room for a user that requests one.
     * The server should return the ROOM_CREATED event that triggers the operations of this socket.
     * This is when the room: IROOM file will be sent to the client from the server.
     */
    Socket.get().on(events.ROOM_CREATED, (room: IRoom) => {
      console.log(`UPLOADING SOURCE TO: ${room.id}`);
      // When the room is created upload the source
      this.uploadEvents.uploadSourceFolder(room);
    });

    /**
     * JOIN_AUTH
     * This socket should be activated once the server has added a user to a room.
     */
    Socket.get().on(events.JOIN_AUTH, (room: IRoom) => {
      console.log(`WATCHING ${room.id}`);
      this.shadowFolderHandler = new ShadowFolderHandler(room);
      this.sourceFolderHandler = new SourceFolderHandler(room);
    });

    /**
     * JOIN_ERR
     */
    Socket.get().on(events.JOIN_ERR, (err: string) => {
      console.error(err);
    });

    /**
     * ROOM_LEFT
     */
    Socket.get().on('ROOM_LEFT', (msgBack: string) => {
      console.log('Left room'); // msg to CLI
    });

    /**
     * FILE_CHANGE
     * This socket handles all the folder operation as well as creation and deletion of files.
     */
    Socket.get().on(events.FILE_CHANGE, (ifileChange: IFileChange) => {
      console.log('Sending filechange.........');
      this.shadowFolderHandler.update(ifileChange.fileChange);
    });

    /**
     * FILE_PATCH
     * This socket handles all the file operations that got their internal data modified.
     */
    Socket.get().on(events.FILE_PATCH, (iPatch: IPatch) => {
      console.log('Sending patch.................');
      this.shadowFolderHandler.updatePatch(iPatch);
    });
  }
}
