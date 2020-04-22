import { DownloadEvents } from './transfer';
import { patchWatch } from './patch';
import events from '../common/events';
import { IRoom, EventHandler } from '../common/interfaces';
import RoomClass from '../classes/Room';

export class RoomEvents implements EventHandler {
  private downloadEvents: DownloadEvents;

  constructor(private server: SocketIOClient.Socket) {
    // Create events for incoming downloads
    this.downloadEvents = new DownloadEvents(this.server);
    this.addEvents();
  }

  addEvents(): void {
    this.server.on(events.ROOM_CREATED, (room: RoomClass) => {
      console.log(`created room ${room.roomID}`);
      // When the room is created upload the source
      this.downloadEvents.uploadSource(this.server, room);
    });

    this.server.on(events.ROOM_AUTH, (room: RoomClass) => {
      console.log('watching for changes...');
      // Watch the specified repository for changes

      patchWatch(room.roomFolderPath, room.roomID).on('patch', diffs => {
        console.log('sending patch');
        // Send the patch to the server
        this.server.emit(events.PATCH, {
          room,
          diffs
        });
      });
    });
  }
}
