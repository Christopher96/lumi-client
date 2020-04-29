import express from 'express';
import Route from '@src/network/server/routes/Route';
import EchoRoute from '@src/network/server/routes/EchoRoute';
import VersionRoute from '@src/network/server/routes/VersionRoute';
import CreateRoute from '@src/network/server/routes/CreateRoute';
import JoinRoute from '@src/network/server/routes/JoinRoute';
import HealthCheckRoute from '@src/network/server/routes/HealthCheckRoute';
import ClientSocket from '@src/network/socket/ClientSocket';
import LeaveRoute from '@src/network/server/routes/LeaveRoute';
import SourceDirectoryWatcher from '@src/fs/SourceDirectoryWatcher';

export default class ExpressServer {
  private app: express.Application;
  private clientSocket: ClientSocket;
  private sourceDirectoryWatcher: SourceDirectoryWatcher;

  constructor(clientServerPort: number, socketHost: string, socketPort: number) {
    this.app = express();
    
    this.clientSocket = new ClientSocket(`http://${socketHost}:${socketPort}`);
    this.sourceDirectoryWatcher = new SourceDirectoryWatcher();

    this.register(new EchoRoute());
    this.register(new VersionRoute());
    this.register(new HealthCheckRoute());
    this.register(new CreateRoute(this.clientSocket));
    this.register(new JoinRoute(this.clientSocket, this.sourceDirectoryWatcher));
    this.register(new LeaveRoute(this.clientSocket, this.sourceDirectoryWatcher));

    this.app.listen(clientServerPort, 'localhost', () => {
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
