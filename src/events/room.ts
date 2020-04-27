import fs from 'fs';
import events from '@common/events';
import { EventHandler, IRoom, IFileChange } from '@common/interfaces';
import { UploadEvents } from './upload';
import Socket from '@src/socket';
import { ShadowHandler } from '@src/fs/shadowHandler';


export class RoomEvents implements EventHandler {
  private uploadEvents: UploadEvents;
  private shadowHandler: ShadowHandler;

  constructor() {
    // Create events for incoming downloads
    this.uploadEvents = new UploadEvents();
    this.addEvents();
  }

  createRoom(source: string) {
    if (fs.existsSync(source)) {
      Socket.get().emit(events.CREATE_ROOM, source);
    } else {
      throw new Error('Source does not exist');
    }
  }

  addEvents(): void {
    Socket.get().on(events.ROOM_CREATED, (room: IRoom) => {
      console.log(`created room ${room.id}`);
      // When the room is created upload the source
      this.uploadEvents.uploadSource(room);
    });

    Socket.get().on(events.ROOM_AUTH, (room: IRoom) => {
      console.log(`created room ${room.id}`);
      this.shadowHandler = new ShadowHandler(room.sourceFolderPath);

      // When the room is created upload the source
      // this.downloadEvents.uploadSource(this.server, room);

      // patchWatch(room.roomFolderPath, room.roomID).on('patch', diffs => {
      //   console.log('sending patch');
      //   // Send the patch to the server
      //   Socket.get().emit(events.PATCH, {
      //     room,
      //     diffs
      //   });
      // });
    });


    Socket.get().on('ROOM_LEFT', (msgBack: string) => {
      console.log('Left room'); // msg to CLI
    })
                    
    Socket.get().on(events.FILE_CHANGE, (ifileChange: IFileChange) => {
      this.shadowHandler.update(ifileChange.fileChange);
    });
  }
}
