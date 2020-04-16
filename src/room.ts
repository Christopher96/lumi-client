import { DownloadEvents } from 'transfer';
import events from 'common/events';
import { patchWatch } from 'patch';
import { Room, EventHandler } from 'common/interfaces';

export class RoomEvents implements EventHandler {
  private downloadEvents: DownloadEvents;

  constructor(private server: SocketIOClient.Socket) {
    // Create events for incoming downloads
    this.downloadEvents = new DownloadEvents(this.server);
    this.addEvents();
  }

  addEvents(): void {
    this.server.on(events.ROOM_CREATED, (room: Room) => {
      console.log(`created room ${room.id}`);
      // When the room is created upload the source
      this.downloadEvents.uploadSource(this.server, room);
    });

    this.server.on(events.ROOM_AUTH, (room: Room) => {
      console.log('watching for changes...');
      // Watch the specified repository for changes

      patchWatch(room.source, room.id).on('patch', diffs => {
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
