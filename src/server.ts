import events from './common/events';
import { User, Room, Chunk, Message } from './common/interfaces';
import { patchWatch } from './watch';
import { patchApply } from './common/apply';
import { readChunks } from './common/read';
import { writeChunk } from './common/copy';

export const serverHandler = (server: SocketIOClient.Socket): void => {
  // Set the path to the repo you want to synchronize
  // TODO Add a selection in frontend

  let filesToUpload = 0;

  server.on(events.ROOM_CREATED, (room: Room) => {
    console.log(`created room ${room.id}`);

    const { files, emitter } = readChunks(room.source);
    filesToUpload = files.length;

    emitter.on('chunk', chunk => {
      console.log(`uploading ${chunk.path}`);
      server.emit(events.DOWNLOAD_CHUNK, {
        room,
        chunk
      });
    });
  });
  server.on(events.ROOM_AUTH, (room: Room) => {
    console.log('watching for changes...');
    // Watch the specified repository for changes
    patchWatch(room.source, room.id).on('patch', diffs => {
      console.log('sending patch');
      // Send the patch to the server
      server.emit(events.PATCH, {
        room,
        diffs
      });
    });
  });

  server.on(events.DOWNLOAD_OK, data => {
    const { room } = data;

    filesToUpload--;

    if (filesToUpload == 0) {
      server.emit(events.JOIN_ROOM, room);
    }
  });

  server.on(events.DOWNLOAD_CHUNK, data => {
    const { chunk } = data;
    writeChunk(chunk)
      .then(() => {
        server.emit(events.DOWNLOAD_OK, data);
      })
      .catch(() => {
        server.emit(events.DOWNLOAD_ERR, data);
      });
  });

  server.on(events.DOWNLOAD_ERR, () => {
    // TODO Stop stream on upload error
  });

  // On incoming patches of other clients
  server.on(events.PATCH, (patch: Diff.ParsedDiff[]) => {
    // Apply the patch to the shadow directory
    patchApply(patch).then(() => console.log('patched'));
  });

  // On patches that have been sent but not accepted by the server
  server.on(events.PATCH_ERR, () => {
    // TODO Alert the user that the patch could not be applied
    console.log('invalid patch, could not apply it');
  });

  // On response from server with list of users
  server.on(events.LIST_USERS, (users: User[]) => {
    console.log(users);
  });

  // On message from other client
  server.on(events.MESSAGE, (msg: Message) => {
    console.log(msg);
  });
};
