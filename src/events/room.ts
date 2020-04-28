import fs from 'fs';
import events from '@common/events';
import { EventHandler, IRoom, IFileChange } from '@common/interfaces';
import { UploadEvents } from './upload';
import Socket from '@src/socket';
import { DownloadEvents } from './download';
import { SourceFolderHandler } from '@src/fs/sourceFolderHandler';
import { ShadowFolderHandler } from '@src/fs/shadowFolderHandler';

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

  public static createRoom(source: string) {
    console.log('CREATING ROOM');
    if (fs.existsSync(source)) {
      Socket.get().emit(events.CREATE_ROOM, source);
    } else {
      throw new Error('Source does not exist');
    }
  }

  public static joinRoom(roomID: string) {
    Socket.get().emit(events.JOIN_ROOM, roomID);
  }

  addEvents(): void {
    Socket.get().on(events.ROOM_CREATED, (room: IRoom) => {
      console.log(`UPLOADING SOURCE TO: ${room.id}`);
      // When the room is created upload the source
      this.uploadEvents.uploadSourceFolder(room);
    });

    Socket.get().on(events.JOIN_AUTH, (room: IRoom) => {
      this.shadowFolderHandler = new ShadowFolderHandler(room);
      this.sourceFolderHandler = new SourceFolderHandler(room);
    });

    Socket.get().on(events.JOIN_ERR, (err: string) => {
      console.error(err);
    });

    Socket.get().on('ROOM_LEFT', (msgBack: string) => {
      console.log('Left room'); // msg to CLI
    });

    Socket.get().on(events.FILE_CHANGE, (ifileChange: IFileChange) => {
      this.shadowFolderHandler.update(ifileChange.fileChange);
    });
  }
}
