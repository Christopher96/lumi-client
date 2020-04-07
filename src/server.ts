import events from './events';
import { User, Room } from './interfaces';
import { patchWatch } from './watch';
import { patchApply } from './apply';
import { readChunks } from './read';
import { copySource } from './copy';

export const serverHandler = (server: SocketIOClient.Socket): void => {
  // Set the path to the repo you want to synchronize
  // TODO Add a selection in frontend
  const source = 'test-repo';

  server.emit(events.CREATE_ROOM, source);

  server.on(events.ROOM_CREATED, (room: Room) => {
    console.log(`created room ${room.id}`);

    copySource(source, room.copy).then(() => {
      readChunks(source)
        .on('chunk', chunk => {
          console.log(`uploading ${chunk.path}`);
          server.emit(events.UPLOAD_CHUNK, {
            room,
            chunk
          });
        })
        .on('done', () => {
          server.emit(events.JOIN_ROOM, room);
        });
    });
  });

  server.on(events.UPLOAD_ERR, () => {
    // TODO Stop stream on upload error
  });

  server.on(events.ROOM_AUTH, (room: Room) => {
    console.log('watching for changes...');
    // Watch the specified repository for changes
    patchWatch(source, room.copy).on('patch', diffs => {
      console.log('sending patch');
      // Send the patch to the server
      server.emit(events.PATCH, {
        room,
        diffs
      });
    });
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
  server.on(events.MESSAGE, (msg: string) => {
    console.log(msg);
  });
};
