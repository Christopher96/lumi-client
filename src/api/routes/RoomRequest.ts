import { API, DefaultServerResponse } from '../API';
import io from 'socket.io-client';
import { Events } from './SocketEvents';

export class RoomRequest {
  static create(buffer: Buffer) {
    return new API().upload<DefaultServerResponse & { roomId: string }>('/room/create', buffer);
  }

  static getRoom(roomId: string) {
    return new API().get<DefaultServerResponse & { room: string }>('/room/' + roomId);
  }

  static listRooms() {
    return new API().get<DefaultServerResponse>('/room/all');
  }

  static listUsersInRoom(roomId: string) {
    return new API().get<DefaultServerResponse & { users: string[] }>('/room/users/' + roomId);
  }

  static downloadRoom(roomId: string) {
    return new API().download('/room/download/' + roomId);
  }

  static joinRoom(roomId: string): Promise<SocketIOClient.Socket> {
    // Create the server instance with the server
    const socket = io(process.env.SERVER_ENDPOINT, {
      transports: ['websocket']
    });

    socket.on(Events.room_join_err, error => {
      throw new Error(error.message);
    });

    return new Promise(res =>
      socket.once('connect', () => {
        socket.emit(Events.room_join, roomId);
        socket.on(Events.room_join_res, () => res(socket));
      })
    );
  }
}
