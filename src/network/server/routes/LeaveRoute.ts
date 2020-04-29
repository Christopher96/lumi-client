import Route from '@src/network/server/routes/Route';
import { Request, Response } from 'express';
import { ParamsDictionary, Query } from 'express-serve-static-core';
import ClientSocket from '@src/network/socket/ClientSocket';
import SourceDirectoryWatcher from '@src/fs/SourceDirectoryWatcher';

export default class LeaveRoute extends Route {
  protected description: string = 'Leaves the room';
  protected name: string = 'leave';
  protected shortName: string = 'l';
  protected numberOfArguments: number = 0;

  private clientSocket: ClientSocket;
  private sourceDirectoryWatcher: SourceDirectoryWatcher;

  constructor(clientSocket: ClientSocket, sourceDirectoryWatcher: SourceDirectoryWatcher) {
    super();
    this.clientSocket = clientSocket;
    this.sourceDirectoryWatcher = sourceDirectoryWatcher;
  }

  public async exec(req: Request<ParamsDictionary, any, any, Query>, res: Response): Promise<void> {
    this.clientSocket.leaveRoom();
    await this.sourceDirectoryWatcher.close();
    res.send('You have left the room');
  }
}
