import events from '../common/events';
import { IRoom, EventHandler } from '../common/interfaces';
import { readZip } from '../common/read';
import Socket from '../socket';

export class UploadEvents implements EventHandler {
  constructor() {
    this.addEvents();
  }

  uploadSource(room: IRoom): void {
    // Read the chunks from the source
    const emitter = readZip(room.sourceFolderPath);

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
    Socket.get().on(events.UPLOAD_OK, data => {
      console.log('upload ok');
    });

    Socket.get().on(events.UPLOAD_DONE, data => {
      console.log('upload done');
      Socket.get().emit(events.JOIN_ROOM, data.room);
    });
  }
}
