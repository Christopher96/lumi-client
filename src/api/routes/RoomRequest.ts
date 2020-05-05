import { API, DefaultServerResponse } from '../API';
import io from 'socket.io-client';
import { Events } from './SocketEvents';
import { Console } from '@src/lib/utils/Console';
import { FS } from '@src/lib/common/FS';

export class RoomRequest {
  static create(buffer: Buffer) {
    return new API().upload<DefaultServerResponse & { roomId: string }>('/room/create', buffer);
  }

  static getRoom(roomId: string) {
    return new API().get<DefaultServerResponse & { room: string }>('/room/' + roomId);
  }

  static listRooms() {
    return new API().get<DefaultServerResponse>('/room/list');
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
          FS.closeWatcher();
          socket.close();
        });
      })
    );
  }
}
