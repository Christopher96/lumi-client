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
export class JoinRoute extends Route {
  protected readonly name = 'join';
  protected readonly shortName = 'j';
  protected readonly description =
    'This route enables user to request to join a specified room (roomID) sent as argument. Then gets a message when room has been joined';
  protected readonly numberOfArguments = 0;
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
    const socket = Socket.get();
    //Asks server to join room with ID roomID
    socket.emit(events.JOIN_ROOM, roomID);

    // TODO test if works
    //socket.on('JOINED_ROOM', roomID => {
    res.send('You have requested to join a room');
    //});
    // Sends a message to CLI that client joined room with ID = roomID
    //res.send(You have succesfully joined a room! ${roomID});
  }
}
