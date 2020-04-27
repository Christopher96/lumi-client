import path from 'path';

// This is a file which sets up all the
// funcitonality
import 'reflect-metadata';
import dotenv from 'dotenv';
import API from './api/api';
import Socket from './socket';
import { CLI } from './cli/cli';

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

    Socket.create();

    const clientPort = process.env.CLIENT_SERVER_PORT;

    if (!clientPort) {
      throw new Error('You need to configure a client server port');
    }

    if (process.argv[2] === 'START_SERVER') {
      console.log('Starting server');
      new API(Socket.get(), Number.parseFloat(clientPort));
    } else {
      new CLI();
    }
  }
}
