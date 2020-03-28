import dotenv from 'dotenv';
import io from 'socket.io-client';
import events from './events';
import { User } from './interfaces';
import { patchApply, patchWatch } from './watch';
dotenv.config();

const bootstrap = async (): Promise<void> => {
  const host = process.env.HOST || 'localhost';
  const port = process.env.PORT || '8080';

  const serverUrl = `http://${host}:${port}`;

  const syncSource = 'test-repo';

  const socket = io(serverUrl, {
    transports: ['websocket']
  });

  socket.on(events.PATCH, (patch: Diff.ParsedDiff[]) => {
    patchApply(patch).then(() => console.log('patched'));
  });

  socket.on(events.CLIENT_CONNECT, () => {
    console.log('connected');
    patchWatch(syncSource).on('patched', patch => {
      console.log('sending patch');
      socket.emit(events.PATCH, patch);
    });
  });

  socket.on(events.LIST_USERS, (users: User[]) => {
    console.log(users);
  });

  socket.on(events.MESSAGE, (msg: string) => {
    console.log(msg);
  });
};

bootstrap();
