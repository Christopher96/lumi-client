import events from './common/events';
import { User, Room, Chunk, Message } from './common/interfaces';
import { patchEvents } from './patch';
import { roomEvents } from './room';
import { downloadEvents } from './transfer';

export const socketHandler = (server: SocketIOClient.Socket): void => {
  downloadEvents(server);
  roomEvents(server);
  patchEvents(server);

  // On response from server with list of users
  server.on(events.LIST_USERS, (users: User[]) => {
    console.log(users);
  });

  // On message from other client
  server.on(events.MESSAGE, (msg: Message) => {
    console.log(msg);
  });
};
