import io from 'socket.io-client';
import events from './common/events';
import { SocketHandler } from './events/socket';
import { CLI } from './cli';
import { API } from './api';

export default class Socket {
  static startSocket(serverUrl: string): SocketIOClient.Socket {
    // Create the server instance with the server
    const server: SocketIOClient.Socket = io(serverUrl, {
      transports: ['websocket']
    });

    // On connection to the server
    server.on(events.CLIENT_CONNECT, () => {
      console.log('connected');
      // Handle the connection to the server
      new SocketHandler(server);

      // Start a CLI
      //new CLI(server);
      new CLI();

      // Start express API
      new API(server, 4000);
    });

    return server;
  }
}

