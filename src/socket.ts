import events from 'common/events';
import { User, Message, EventHandler } from 'common/interfaces';
import { PatchEvents } from 'patch';
import { RoomEvents } from 'room';

export class SocketHandler implements EventHandler {
  constructor(private server: SocketIOClient.Socket) {
    new RoomEvents(this.server);
    new PatchEvents(this.server);

    this.addEvents();
  }

  addEvents(): void {
    // On response from server with list of users
    this.server.on(events.LIST_USERS, (users: User[]) => {
      console.log(users);
    });

    // On message from other client
    this.server.on(events.MESSAGE, (msg: Message) => {
      console.log(msg);
    });
  }
}
