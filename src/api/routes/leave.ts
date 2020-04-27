import { Route, RouteParamsTypes } from './route';
import { Request, Response } from 'express';
import { ParamsDictionary, Query } from 'express-serve-static-core';
import events from '../../common/events';
//import { Socket } from 'dgram';
//import roomClass from classes/Room;

/**
 * This route will be accesed with a roomID when a client wants to leave a room
 * It will use the roomID and send a request to leave this room
 * @author Tobias Johannesson
 * Written 2020-04-23
 */
export class LeaveRoute extends Route {
  protected readonly name = 'leave';
  protected readonly shortName = 'l';
  protected readonly description = 'Allows user to leave current room, room with ID = roomID, args[0]';
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

    // ID of room to leave/ current room
    const roomID = args[0];
    // Current socket
    const socket = io();
    //Asks server to leave room with ID roomID
    socket.emit('LEAVE_ROOM', roomID);

    res.send('Requested to leave room'); // msg to CLI
  }
}
