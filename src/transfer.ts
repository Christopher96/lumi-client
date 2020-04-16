import events from 'common/events';
import { writeChunk } from 'common/copy';
import { readChunks } from 'common/read';
import { Room, EventHandler } from 'common/interfaces';

export class DownloadEvents implements EventHandler {
  constructor(private socket: SocketIOClient.Socket) {
    this.addEvents();
  }

  private filesToUpload: number;

  uploadSource(server: SocketIOClient.Socket, room: Room): void {
    // Read the chunks from the source
    const { files, emitter } = readChunks(room.source);

    // Update the number of files we want to upload
    this.filesToUpload = files.length;

    // When a file in the source has been read
    emitter.on('chunk', chunk => {
      console.log(`uploading ${chunk.path}`);
      // Send it to the server
      server.emit(events.DOWNLOAD_CHUNK, {
        room,
        chunk
      });
    });
  }

  addEvents(): void {
    // The server successfully downloaded the file
    this.socket.on(events.DOWNLOAD_OK, data => {
      const { room } = data;

      // Decrement the number of files to upload
      this.filesToUpload--;

      if (this.filesToUpload == 0) {
        // Join the room once all files are uploaded
        this.socket.emit(events.JOIN_ROOM, room);
      }
    });

    // When we get a file from the server
    this.socket.on(events.DOWNLOAD_CHUNK, data => {
      const { chunk } = data;

      // Write it locally
      writeChunk(chunk)
        .then(() => {
          // We acknowledge and respond to the incoming file
          this.socket.emit(events.DOWNLOAD_OK, data);
        })
        .catch(() => {
          // We could not write the file
          this.socket.emit(events.DOWNLOAD_ERR, data);
        });
    });

    this.socket.on(events.DOWNLOAD_ERR, () => {
      // TODO Stop stream on upload error
    });
  }
}
