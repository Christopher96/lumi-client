import events from '@common/events';
import { IRoom, EventHandler, Chunk, IChunk } from '@common/interfaces';
import { readZip } from '../common/read';
import Socket from '../socket';
import Zip from '@common/zip';

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
    emitter.on('chunk', (chunk: Chunk) => {
      console.log(`uploading chunk, progress: ${chunk.progress}`);

      const ichunk: IChunk = {
        chunk,
        room
      };

      // Send it to the server
      Socket.get().emit(events.DOWNLOAD_CHUNK, ichunk);
    });
  }

  addEvents(): void {
    // The server successfully downloaded the file
    Socket.get().on(events.UPLOAD_OK, (chunk: IChunk) => {
      console.log(chunk);
    });

    Socket.get().on(events.UPLOAD_DONE, (chunk: IChunk) => {
      console.log(chunk);
      Socket.get().emit(events.JOIN_ROOM, chunk.room);
    });
  }
}
