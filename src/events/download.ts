import { IChunk, EventHandler } from '@common/interfaces';
import events from '@common/events';
import { writeChunk } from '@common/write';
import Zip from '@common/zip';
import Socket from '@src/socket';

export class DownloadEvents implements EventHandler {
  constructor() {
    this.addEvents();
  }

  addEvents(): void {
    // When we get a file from the client
    Socket.get().on(events.DOWNLOAD_CHUNK, (ichunk: IChunk) => {
      const { room, chunk } = ichunk;
      const shadowPath = `.${room.sourceFolderPath}`;
      const zipPath = `${shadowPath}/${chunk.source}`;

      // Write it locally
      writeChunk(chunk, zipPath)
        .then(() => {
          if (chunk.progress == 1) {
            // We acknowledge and respond to the incoming file
            Socket.get().emit(events.UPLOAD_DONE, ichunk);
            const zip = new Zip();
            zip.unpack(zipPath, shadowPath);
          } else {
            Socket.get().emit(events.UPLOAD_OK, ichunk);
          }
        })
        .catch(() => {
          // We could not write the file
          Socket.get().emit(events.UPLOAD_ERR, ichunk);
        });
    });
  }
}
