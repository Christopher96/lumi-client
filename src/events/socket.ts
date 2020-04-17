import fs from 'fs';
import events from '../common/events';
import { User, Message, EventHandler } from '../common/interfaces';
import usersDb from '../database/users.json';
import { PatchEvents } from './patch';
import { RoomEvents } from './room';

export class SocketHandler implements EventHandler {
  constructor(private server: SocketIOClient.Socket) {
    new RoomEvents(this.server);
    new PatchEvents(this.server);

    this.addEvents();
  }

  addEvents(): void {
    // On response from server with list of users
    this.server.on(events.LIST_USERS, (users: User[]) => {
      // TODO Write users to json file
    });

    // On message from other client
    this.server.on(events.MESSAGE, (msg: Message) => {
      console.log(msg);
    });
  }
}
