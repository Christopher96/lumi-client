import path from 'path';

// This is a file which sets up all the
// funcitonality
import 'reflect-metadata';
import dotenv from 'dotenv';
import CLI from '@src/cli/CLI';
import ExpressServer from '@src/network/server/ExpressServer';

export default class Bootstrap {
  static init(): void {
    if (process.env.NODE_ENV === 'prod') {
      dotenv.config({
        path: path.resolve(process.cwd(), '.env')
      });
    } else {
      dotenv.config({
        path: path.resolve(process.cwd(), '.env.local')
      });
    }

    const socketHost = process.env.SOCKET_HOST;
    const socketPort = process.env.SOCKET_PORT;
    const clientServerPort = process.env.CLIENT_SERVER_PORT;

    if (!clientServerPort || !socketHost || !socketPort) {
      throw new Error('You need to configure host and port.');
    }

    if (process.argv[2] === 'START_SERVER') {
      console.log('Starting server');
      new ExpressServer(Number.parseInt(clientServerPort), socketHost, Number.parseInt(socketPort));
    } else {
      new CLI();
    }
  }
}
