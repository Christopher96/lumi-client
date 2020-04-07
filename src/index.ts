import dotenv from 'dotenv';
import io from 'socket.io-client';
import events from './events';
import { serverHandler } from './server';
dotenv.config();

const bootstrap = async (): Promise<void> => {
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
    serverHandler(server);
  });
};

bootstrap();
