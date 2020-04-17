import dotenv from 'dotenv';
import io from 'socket.io-client';
import events from './common/events';
import { SocketHandler } from './events/socket';
import { CLI } from './cli';
import { API } from './api';
dotenv.config();

class Bootstrap {
  constructor() {
    // Configure PORT and HOST to the environment variables set in .env
    // or use localhost:8080 locally
    const host = process.env.HOST || 'localhost';
    const port = process.env.PORT || '8080';

    const serverUrl = `http://${host}:${port}`;

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
      new CLI(server);

      // Start express API
      new API(server, 4000);
    });
  }
}

new Bootstrap();
