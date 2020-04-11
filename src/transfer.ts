import events from './common/events';
import { writeChunk } from './common/copy';
import { readChunks } from './common/read';
import { Room } from './common/interfaces';

let filesToUpload = 0;

export const uploadSource = (client: SocketIOClient.Socket, room: Room): void => {
  const { files, emitter } = readChunks(room.source);
  filesToUpload = files.length;

  emitter.on('chunk', chunk => {
    console.log(`uploading ${chunk.path}`);
    client.emit(events.DOWNLOAD_CHUNK, {
      room,
      chunk
    });
  });
};

export const downloadEvents = (socket: SocketIOClient.Socket): void => {
  socket.on(events.DOWNLOAD_OK, data => {
    const { room } = data;

    filesToUpload--;

    if (filesToUpload == 0) {
      socket.emit(events.JOIN_ROOM, room);
    }
  });

  socket.on(events.DOWNLOAD_CHUNK, data => {
    const { chunk } = data;
    writeChunk(chunk)
      .then(() => {
        socket.emit(events.DOWNLOAD_OK, data);
      })
      .catch(() => {
        socket.emit(events.DOWNLOAD_ERR, data);
      });
  });

  socket.on(events.DOWNLOAD_ERR, () => {
    // TODO Stop stream on upload error
  });
};
