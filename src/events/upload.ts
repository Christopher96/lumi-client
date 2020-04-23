import events from '../common/events';
import { Room, EventHandler } from '../common/interfaces';
import { readZip } from '../common/read';

export class UploadEvents implements EventHandler {
  constructor() {
    this.addEvents();
  }

  uploadSource(room: Room): void {
    // Read the chunks from the source
    const emitter = readZip(room.source);

    // When a file in the source has been read
    emitter.on('chunk', chunk => {
      console.log(`uploading ${chunk.path}`);
      // Send it to the server
      Socket.get().emit(events.DOWNLOAD_CHUNK, {
        room,
        chunk
      });
    });
  }

  addEvents(): void {
    // The server successfully downloaded the file
    this.socket.on(events.UPLOAD_OK, data => {
      this.socket.emit(events.JOIN_ROOM, data.room);
    });
  }
}
