import express from 'express';
import Route from '@src/network/express/routes/Route';
import EchoRoute from '@src/network/express/routes/EchoRoute';
import VersionRoute from '@src/network/express/routes/VersionRoute';
//import { CreateRoute } from './routes/createRoom';
//import { JoinRoute } from './routes/join';
import HealthCheckRoute from '@src/network/express/routes/HealthCheckRoute';
//import { LeaveRoute } from './routes/leave';

export default class ExpressServer {
  private app: express.Application;

  constructor(port: number) {
    this.app = express();

    this.register(new EchoRoute());
    this.register(new VersionRoute());
    //this.register(new CreateRoute());
    //this.register(new JoinRoute());
    //this.register(new LeaveRoute());
    this.register(new HealthCheckRoute());

    this.app.listen(port, () => {
      console.log('Client server is running');
    });
  }

  private register(route: Route): void {
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
