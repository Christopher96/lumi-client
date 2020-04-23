import events from '../common/events';
import { IRoom, EventHandler, IChunk } from '../common/interfaces';
import { readZip } from '../common/read';
import Socket from '../socket';
import Zip from '../common/zip';

export class UploadEvents implements EventHandler {
  constructor() {
    this.addEvents();
  }

  uploadSource(room: IRoom): void {
    const zip = new Zip();
    const source = room.sourceFolderPath;
    const dest = `${source}.zip`;

    zip.pack(source, dest);

    // Read the chunks from the zip
    const emitter = readZip(dest);

    // When a file in the source has been read
    emitter.on('chunk', (chunk: IChunk) => {
      console.log(`uploading chunk, progress: ${chunk.progress}`);
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
