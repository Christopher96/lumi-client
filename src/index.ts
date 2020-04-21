import Bootstrap from './bootstrap';
import Socket from './socket';

const serverUrl = Bootstrap.init();
Socket.startSocket(serverUrl);
