import { uploadSource } from './transfer';
import events from './common/events';
import { patchWatch } from './patch';
import { Room } from './common/interfaces';

export const roomEvents = (server: SocketIOClient.Socket): void => {
  server.on(events.ROOM_CREATED, (room: Room) => {
    console.log(`created room ${room.id}`);
    uploadSource(server, room);
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
};
