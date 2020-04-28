import fs from 'fs';
import events from '@common/events';
import { EventHandler, IRoom, IFileChange, IPatch } from '@common/interfaces';
import { UploadEvents } from './upload';
import Socket from '@src/socket';
import { ShadowHandler } from '@src/fs/shadowHandler';
import { DownloadEvents } from './download';
import { SourceFolderHandler } from '@src/fs/sourceFolderHandler';

export class RoomEvents implements EventHandler {
  private uploadEvents: UploadEvents;
  private sourceFolderHandler: SourceFolderHandler;
  private shadowHandler: ShadowHandler;

  constructor() {
    // Create events for incoming downloads
    new DownloadEvents();
    this.uploadEvents = new UploadEvents();
    this.addEvents();
  }

  createRoom(source: string) {
    console.log('CREATING ROOM');
    if (fs.existsSync(source)) {
      Socket.get().emit(events.CREATE_ROOM, source);
    } else {
      throw new Error('Source does not exist');
    }
  }

  addEvents(): void {
    Socket.get().on(events.ROOM_CREATED, (room: IRoom) => {
      console.log(`UPLOADING SOURCE TO: ${room.id}`);
      // When the room is created upload the source
      this.uploadEvents.uploadSourceFolder(room);
    });

    Socket.get().on(events.JOIN_AUTH, (room: IRoom) => {
      console.log(`WATCHING ${room.id}`);
      this.shadowHandler = new ShadowHandler(room);

      // adding the correct path to the client's shadow folder to the room interface.
      //room.shadowFolderPath = this.shadowHandler.getShadowFolder();
      this.sourceFolderHandler = new SourceFolderHandler(room);
    });

    Socket.get().on(events.JOIN_ERR, (err: string) => {
      console.error(err);
    });

    Socket.get().on('ROOM_LEFT', (msgBack: string) => {
      console.log('Left room'); // msg to CLI
    });

    Socket.get().on(events.FILE_CHANGE, (ifileChange: IFileChange) => {
      this.shadowHandler.update(ifileChange.fileChange);
    });

    Socket.get().on(events.FILE_PATCH, (iPatch: IPatch) => {
      this.shadowHandler.updatePatch(iPatch);
    });
  }
}
