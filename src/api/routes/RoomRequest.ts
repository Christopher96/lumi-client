import { API, DefaultServerResponse } from '../API';
import io from 'socket.io-client';
import { Events } from './SocketEvents';
import { Console } from '../../lib/utils/Console';
import { FS } from '../../lib/common/FS';

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

        // This code should run when the client has been kicked.
        socket.on(Events.room_kick_res, (message: string) => {
          Console.error(message);
          process.exit();
        });

        socket.on(Events.room_kick_err, (message: string) => {
          Console.error(message);
        });

        socket.on(Events.room_leave_res, () => {
          Console.yellow('You have left the room');
        });

        socket.on(Events.room_leave_err, (message: string) => {
          Console.error(message);
        });
      })
    );
  }
}
