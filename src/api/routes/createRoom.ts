import { Route, RouteParamsTypes } from './route';
import { Request, Response } from 'express';
import { ParamsDictionary, Query } from 'express-serve-static-core';
import events from '../../common/events';
import Socket from '../../socket';
//import { Socket } from 'dgram';
//import roomClass from classes/Room;

/**
 * This route will be accesed with a roomID when a client wants to join a room
 * It will use the roomID and send a request to join this room
 * @author Tobias Johannesson
 * Written 2020-04-23
 */
export class CreateRoute extends Route {
  protected readonly name = 'create';
  protected readonly shortName = 'c';
  protected readonly description =
    'This route enables user to request to create a room, sends sourceFolderPath, args[0]';
  protected readonly arguments = ['baseUrl'];
  protected readonly params = {
    roomID: {
      optional: true,
      type: RouteParamsTypes.STRING //from CLI down below use id to get room object
    }
  };

  

  public async exec(req: Request<ParamsDictionary, any, any, Query>, res: Response): Promise<void> {
    const event = this.parseReq<{ roomID: string }>(req);
    const { args, params } = event;

    // sourceFolderPath is where the folder to zip and transfer is located
    const sourceFolderPath = args[0];

    // Current socket
    const socket = Socket.get();

    const createRoomId = await this.makeSocketReq(events.CREATE_ROOM, socket);
    const joinRoom = await this.makeSocketReq(event.)

    res.send(createRoomId);
    // TODO test if worked
  }
}
