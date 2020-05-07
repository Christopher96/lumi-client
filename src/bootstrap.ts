import path from 'path';

// This is a file which sets up all the
// funcitonality
import CLI from './cli';
import 'reflect-metadata';
import dotenv from 'dotenv';
// Check if the server endpoint is set, otherwise fall back to default

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

    const defaultUrl = 'http://it-pr-itpro-duw4azjoa0r0-1588304925.eu-west-1.elb.amazonaws.com';
    process.env.SERVER_ENDPOINT = process.env.SERVER_ENDPOINT || defaultUrl;
    const serverEndpoint = process.env.SERVER_ENDPOINT;

    if (!serverEndpoint) {
      throw new Error('You need to configure host and port.');
    }

    new CLI();
  }
}
