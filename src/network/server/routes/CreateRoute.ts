import Route from '@src/network/server/routes/Route';
import { Request, Response } from 'express';
import { ParamsDictionary, Query } from 'express-serve-static-core';
import ClientSocket from '@src/network/socket/ClientSocket';

export default class CreateRoute extends Route {
  protected description: string = 'Creates a new room on the server';
  protected name: string = 'create';
  protected shortName: string = 'c';
  protected numberOfArguments: number = 1;

  private clientSocket: ClientSocket;

  constructor(clientSocket: ClientSocket) {
    super();
    this.clientSocket = clientSocket;
  }

  public async exec(req: Request<ParamsDictionary, any, any, Query>, res: Response): Promise<void> {
    const event = this.parseReq<{}>(req);
    const { args } = event;

    const sourceDirectoryPath = args[0];

    const roomID = await this.clientSocket.createRoom(sourceDirectoryPath);

    res.send(roomID);
  }
}
