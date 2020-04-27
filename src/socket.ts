import io from 'socket.io-client';
import events from './common/events';
import { SocketHandler } from './events/socket';
import Bootstrap from './bootstrap';

export default class Socket {
  private static socket: SocketIOClient.Socket;

  static get(): SocketIOClient.Socket {
    if (!this.socket) {
      throw new Error('Server has not been instantiated yet');
    }
    return this.socket;
  }

  static create(): void {
    const serverUrl = Bootstrap.init();

    // Create the server instance with the server
    this.socket = io(serverUrl, {
      transports: ['websocket']
    });

    // On connection to the server
    this.socket.on(events.CLIENT_CONNECT, () => {
      console.log('connected');
      // Handle the connection to the server
      new SocketHandler();
    });
  }
}
