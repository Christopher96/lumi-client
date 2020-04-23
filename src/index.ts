import { CLI } from './cli';
import API from './api/api';

if (process.argv[2] === 'START_SERVER') {
  new API(null, Number.parseFloat(process.env.CLIENT_SERVER_PORT) || 8080);
} else {
  new CLI();
}
