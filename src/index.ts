import { CLI } from './cli';
import API from './api/api';
import Bootstrap from './bootstrap';

if (process.argv[2] === 'START_SERVER') {
  Bootstrap.init();
} else {
  new CLI();
}
