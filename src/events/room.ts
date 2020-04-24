import fs from 'fs';
import events from '@common/events';
import { EventHandler, IRoom } from '@common/interfaces';
import { UploadEvents } from './upload';
import Socket from '../socket';

export class RoomEvents implements EventHandler {
  private uploadEvents: UploadEvents;

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
  }
}
