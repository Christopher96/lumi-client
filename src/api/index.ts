import express from 'express';
import events from '../common/events';

export class API {
  app: express.Application;

  constructor(private server: SocketIOClient.Socket, port: number) {
    this.app = express();

    this.app.listen(port, () => {
      console.log('app started');
    });
  }

  createEndpoints(): void {
    this.app.get('/users', (req, res) => {
      console.log('hello world');
      this.server.emit(events.LIST_USERS);
    });
  }
}
