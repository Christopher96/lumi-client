import fs from 'fs';
import events from '../common/events';
import { User, Message, EventHandler } from '../common/interfaces';
import usersDb from '../database/users.json';
import { PatchEvents } from './patch';
import { RoomEvents } from './room';
import Socket from '../socket';

export class SocketHandler implements EventHandler {
  constructor() {
    new RoomEvents();
    new PatchEvents();

    this.addEvents();
  }

  addEvents(): void {
    // On response from server with list of users
    Socket.get().on(events.LIST_USERS, (users: User[]) => {
      // TODO Write users to json file
    });

    // On message from other client
    Socket.get().on(events.MESSAGE, (msg: Message) => {
      console.log(msg);
    });
  }
}
