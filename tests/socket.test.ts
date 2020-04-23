import { assert } from 'chai';
import Bootstrap from '../src/bootstrap';
import Socket from '../src/socket';

describe('We shall run a socket from an URL', () => {
  it('We need a Socket class', () => {
    assert.exists(Socket);
  });

  it('We need to create a socket with a URL', function(done) {
    const serverUrl = Bootstrap.init();
    const socket = Socket.startSocket(serverUrl);
    // this.timeout(5000);
    // setTimeout(done, 5500);
    // socket.on(events.CLIENT_CONNECT, () => {
    //   done();
    // });
  });
});
