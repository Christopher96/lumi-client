import dotenv from 'dotenv';
import io from 'socket.io-client';
import events from './events';
import { User } from './interfaces';
import { patchApply, patchWatch } from './watch';
dotenv.config();

const bootstrap = async (): Promise<void> => {
  // Configure PORT and HOST to the environment variables set in .env
  // or use localhost:8080 locally
  const host = process.env.HOST || 'localhost';
  const port = process.env.PORT || '8080';

  const serverUrl = `http://${host}:${port}`;

  // Set the path to the repo you want to synchronize
  const syncSource = 'test-repo';

  // Create the socket instance with the server
  const socket = io(serverUrl, {
    transports: ['websocket']
  });

  // On incoming patches of other clients
  socket.on(events.PATCH, (patch: Diff.ParsedDiff[]) => {
    // Apply the patch to the shadow directory
    patchApply(patch).then(() => console.log('patched'));
  });

  // On connection to the server
  socket.on(events.CLIENT_CONNECT, () => {
    console.log('connected');
    // Watch the specified repository for changes
    patchWatch(syncSource).on('patched', patch => {
      console.log('sending patch');
      // Send the patch to the server
      socket.emit(events.PATCH, patch);
    });
  });

  // On response from server with list of users
  socket.on(events.LIST_USERS, (users: User[]) => {
    console.log(users);
  });

  // On message from other client
  socket.on(events.MESSAGE, (msg: string) => {
    console.log(msg);
  });
};

bootstrap();
