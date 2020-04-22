import express from 'express';
import events from '../common/events';
import Socket from '../socket';

export class API {
  app: express.Application;

  constructor(port: number) {
    this.app = express();

    this.app.listen(port, () => {
      console.log('app started');
    });
  }

  createEndpoints(): void {
    this.app.get('/users', (req, res) => {
      console.log('hello world');
      Socket.get().emit(events.LIST_USERS);
    });
  }
}
