import path from 'path';

// This is a file which sets up all the
// funcitonality
import 'reflect-metadata';
import dotenv from 'dotenv';
import API from './api/api';
import Socket from './socket';

export default class Bootstrap {
  static init(): string {
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
    const socketPort = Number.parseInt(process.env.SOCKET_PORT);

    if (!socketHost || !socketPort) {
      throw new Error('You have to define a port for socket and rest');
    }

    return `http://${socketHost}:${socketPort}`;
  }
}
