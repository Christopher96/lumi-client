import { IChunk, EventHandler } from '@common/interfaces';
import events from '@common/events';
import { writeChunk } from '@common/write';
import Zip from '@common/zip';
import Socket from '@src/socket';

export class DownloadEvents implements EventHandler {
  private tempZip: Buffer;

  constructor() {
    this.tempZip = Buffer.alloc(0);
    this.addEvents();
  }

  clearZipBuffer() {
    this.tempZip = Buffer.alloc(0);
  }

  addEvents(): void {
    // When we get a file from the client
    Socket.get().on(events.DOWNLOAD_CHUNK, (ichunk: IChunk) => {
      const { room, chunk } = ichunk;

      this.tempZip = Buffer.concat([this.tempZip, ichunk.chunk.data]);

      if (chunk.progress == 1) {
        // We acknowledge and respond to the incoming file
        Socket.get().emit(events.UPLOAD_DONE, ichunk);
        new Zip().unpack(this.tempZip, `${room.sourceFolderPath}/${room.shadowFolderPath}`);
        this.clearZipBuffer();
      } else {
        Socket.get().emit(events.UPLOAD_OK, ichunk);
      }
    });
  }
}
