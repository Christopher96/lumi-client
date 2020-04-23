import { patchWatch } from './patch';
import events from '../common/events';
import { Room, EventHandler } from '../common/interfaces';
import { UploadEvents } from './upload';
import Socket from '../socket';

export class RoomEvents implements EventHandler {
  private uploadEvents: UploadEvents;

  constructor() {
    // Create events for incoming downloads
    this.uploadEvents = new UploadEvents();
    this.addEvents();
  }

  addEvents(): void {
    Socket.get().on(events.ROOM_CREATED, (room: Room) => {
      console.log(`created room ${room.id}`);
      // When the room is created upload the source
      this.uploadEvents.uploadSource(room.source);
    });

    Socket.get().on(events.ROOM_AUTH, (room: Room) => {
      console.log(`created room ${room.roomID}`);
      // When the room is created upload the source
      // this.downloadEvents.uploadSource(this.server, room);
    });
      console.log('watching for changes...');
      // Watch the specified repository for changes

      patchWatch(room.roomFolderPath, room.roomID).on('patch', diffs => {
        console.log('sending patch');
        // Send the patch to the server
        Socket.get().emit(events.PATCH, {
          room,
          diffs
        });
      });
    });
  }
}
