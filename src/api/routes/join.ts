import { Route, RouteParamsTypes } from './route';
import { Request, Response } from 'express';
import { ParamsDictionary, Query } from 'express-serve-static-core';
import { Socket } from 'dgram';

import RoomClass from '../../classes/Room';

/**
 *
 */
export class JoinRoute extends Route {
  protected readonly name = 'join';
  protected readonly shortName = 'j';
  protected readonly description = 'this is an auto generated desc. Please change me';
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

    //code here

    // ID of RoomClass client wants to join
    const roomID = args[0];

    //use roomID to get Room object
    const roomToJoin = '...';

    //socket.emit('events.JOIN_ROOM', roomToJoin);
    // Socket.EventEmitter('WANT TO JOIN room', data){}

    res.send(`You have succesfully joined a room! ${roomID}`); // send something to client, cli
  }
}
