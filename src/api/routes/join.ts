import { Route, RouteParamsTypes } from './route';
import { Request, Response } from 'express';
import { ParamsDictionary, Query } from 'express-serve-static-core';
import events from '../../common/events';
//import { Socket } from 'dgram';
//import roomClass from classes/Room;

/**
 * This route will be accesed with a roomID when a client wants to join a room
 * It will use the roomID and send a request to join this room
 * @author Tobias Johannesson
 * Written 2020-04-23
 */
export class JoinRoute extends Route {
  protected readonly name = 'join';
  protected readonly shortName = 'j';
  protected readonly description =
    'This route enables user to request to join a specified room with ID = (roomID), args[0].';
  protected readonly numberOfArguments = 1;
  protected readonly params = {
    roomID: {
      optional: true,
      type: RouteParamsTypes.STRING //from CLI down below use id to get room object
    }
  };

  public async exec(req: Request<ParamsDictionary, any, any, Query>, res: Response): Promise<void> {
    const event = this.parseReq<{ roomID: string }>(req);
    const { args, params } = event;

    // ID of RoomClass client wants to join
    const roomID = args[0];

    // Current socket
    const socket = io();
    // Asks server to join room with ID = roomID
    socket.emit(events.JOIN_ROOM, roomID);

    // Msg back to CLI
    res.send(`You have requested to join a room`);
  }
}
