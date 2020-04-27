import express from 'express';
import events from '@common/events';
import { Route } from './routes/route';
import { EchoRoute } from './routes/echo';
import { VersionRoute } from './routes/version';
import { CreateRoute } from './routes/createRoom';
import { JoinRoute } from './routes/join';
import { HealthCheckRoute } from './routes/healthcheck';
import { LeaveRoute } from './routes/leave';

export class API {
  app: express.Application;

  constructor(private server: SocketIOClient.Socket, port: number) {
    this.app = express();

    this.register(new EchoRoute());
    this.register(new VersionRoute());
    this.register(new CreateRoute());
    this.register(new JoinRoute());
    this.register(new LeaveRoute());
    this.register(new HealthCheckRoute());

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

  register(route: Route): void {
    console.log('Registering route:', route.getPath().shortUrl);
    console.log('Registering route:', route.getPath().url);
    switch (route.getMethod()) {
      case 'GET':
        this.app.get('/' + route.getPath().url, route.callExec());
        this.app.get('/' + route.getPath().shortUrl, route.callExec());
    }

    route.register();
  }
}

export default API;
