import events from '../common/events';
import { EventHandler, IUser, IMessage } from '../common/interfaces';
import { PatchEvents } from './patch';
import { RoomEvents } from './room';
import Socket from '../socket';

export class SocketHandler implements EventHandler {
  constructor() {
    new RoomEvents();
    new PatchEvents();

    this.addEvents();

    // --- TEST CODE ---
    const source = 'test-repo';
    // Create the room with the chosen source folder
    Socket.get().emit(events.CREATE_ROOM, source);
  }

  addEvents(): void {
    // On response from server with list of users
    Socket.get().on(events.LIST_USERS, (users: IUser[]) => {
      // TODO Write users to json file
      console.log(users);
    });

    // On message from other client
    Socket.get().on(events.MESSAGE, (msg: IMessage) => {
      console.log(msg);
    });
  }
}
