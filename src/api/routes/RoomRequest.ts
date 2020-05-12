import { API, DefaultServerResponse } from '../API';
import io from 'socket.io-client';
import { Events } from './SocketEvents';
import { Config } from '../../lib/utils/Config';

export class RoomRequest {
  static create(buffer: Buffer) {
    return new API().upload<DefaultServerResponse & { roomId: string }>('/room/create', buffer);
  }

  static createPassword(roomId: string, password: string) {
    return new API().post<DefaultServerResponse>(
      '/room/create/' + roomId,
      JSON.stringify({ password }),
      'application/json'
    );
  }

  // How to use this function
  // const hash = await getPassword( '<NEWPASSWORD>' );
  // await API.RoomRequest.setPassword(roomId, socket.id, hash);
  static setPassword(roomId: string, userID: string, password: string) {
    return new API().post<DefaultServerResponse>(
      '/room/set/' + roomId,
      JSON.stringify({ userID, password }),
      'application/json'
    );
  }

  static getRoom(roomId: string) {
    return new API().get<DefaultServerResponse & { room: any; ok: boolean }>('/room/' + roomId);
  }

  static listRooms() {
    return new API().get<DefaultServerResponse & { rooms: { id: string; socketCount: number }[] }>('/room/all');
  }

  static listUsersInRoom(roomId: string) {
    return new API().get<DefaultServerResponse & { users: any[]; ok: boolean }>('/room/users/' + roomId);
  }

  static listExtendedUsersInRoom(roomId: string) {
    return new API().get<DefaultServerResponse & { users: any[]; ok: boolean }>(`/room/users/${roomId}?extended=1`);
  }

  static downloadRoom(roomId: string) {
    return new API().download('/room/download/' + roomId);
  }

  static createSocket(): Promise<SocketIOClient.Socket> {
    // Create the server instance with the server
    const socket = io(process.env.SERVER_ENDPOINT, {
      transports: ['websocket']
    });

    return new Promise(resolve => {
      socket.once('connect', () => {
        // If the server asks for our public config read the config and send it back to the server.
        socket.on(Events.public_config, () => {
          Config.get()
            .then(conf => socket.emit(Events.public_config_res, { config: conf.public }))
            .catch(err => socket.emit(Events.public_config_err, 'Failed to get config'));
        });
        resolve(socket);
      });
    });
  }
}
