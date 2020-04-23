import { API } from './api';

new API(null, Number.parseFloat(process.env.CLIENT_SERVER_PORT) || 8080);
