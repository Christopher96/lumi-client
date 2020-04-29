import events from '@common/events';
import { IRoom, EventHandler, Chunk, IChunk } from '@common/interfaces';
import { readZip } from '@common/read';
import Socket from '@src/socket';
import Zip from '@common/zip';

export class UploadEvents implements EventHandler {
  constructor() {
    this.addEvents();
  }

  uploadSourceFolder(room: IRoom): void {
    const zip = new Zip();
    const source = room.sourceFolderPath;

    // Create the zip
    const buf = zip.packExclude(source, room.shadowFolderPath);

    // Read the chunks from the zip
    const emitter = readZip(buf);

    // When a file in the source has been read
    emitter.on('chunk', (chunk: Chunk) => {
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
    Socket.get().on(events.UPLOAD_OK, (ichunk: IChunk) => {
      console.log('UPLOAD OK');
    });

    Socket.get().on(events.UPLOAD_DONE, (ichunk: IChunk) => {
      console.log('UPLOAD DONE');
      // Socket.get().emit(events.JOIN_ROOM, ichunk.room.id);
    });
  }
}
