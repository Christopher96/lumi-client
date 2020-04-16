import dotenv from 'dotenv';
import io from 'socket.io-client';
import events from 'common/events';
import { SocketHandler } from 'socket';
import { InteractiveCLI } from 'cli/interactive';
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

      // TODO Create a CLI with options

      // --interactive
      new InteractiveCLI(server);
    });
  }
}

new Bootstrap();
