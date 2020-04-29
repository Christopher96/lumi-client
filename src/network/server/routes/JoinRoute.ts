import Route from '@src/network/server/routes/Route';
import { Request, Response } from 'express';
import { ParamsDictionary, Query } from 'express-serve-static-core';
import ClientSocket from '@src/network/socket/ClientSocket';
import SourceDirectoryWatcher from '@src/fs/SourceDirectoryWatcher';
import { FileEvent } from '@src/fs/fileEvent';
import ShadowDirectoryUpdater from '@src/fs/ShadowDirectoryUpdater';

export default class JoinRoute extends Route {
  protected description: string = 'Joins a room with a specific ID';
  protected name: string = 'join';
  protected shortName: string = 'j';
  protected numberOfArguments: number = 2;

  private clientSocket: ClientSocket;

  private sourceDirectoryWatcher: SourceDirectoryWatcher;

  constructor(clientSocket: ClientSocket, sourceDirectoryWatcher: SourceDirectoryWatcher) {
    super();
    this.clientSocket = clientSocket;
    this.sourceDirectoryWatcher = sourceDirectoryWatcher;
  }

  public async exec(req: Request<ParamsDictionary, any, any, Query>, res: Response): Promise<void> {
    const event = this.parseReq<{}>(req);
    const { args } = event;

    const sourceDirectoryPath = args[0];
    const roomID = args[1];

    const couldJoin: boolean = await this.clientSocket.joinRoom(sourceDirectoryPath, roomID);

    if (couldJoin) {
      this.sourceDirectoryWatcher.onFileChange(sourceDirectoryPath, (fileEvent: FileEvent, filename: string, fileData?: Buffer) => {
        if (fileData) {
          this.clientSocket.sendFileChange(roomID, fileEvent, filename, fileData);
        } else {
          this.clientSocket.sendFileChange(roomID, fileEvent, filename);
        }
      });

      this.clientSocket.listenForAndApplyFileChanges(sourceDirectoryPath);
    }

    res.send(couldJoin);
  }
}
