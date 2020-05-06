import { API, DefaultServerResponse } from '../API';
import io from 'socket.io-client';
import { Events } from './SocketEvents';
import { Console } from '../../lib/utils/Console';
import { Config } from '../../lib/utils/Config';
import { FS } from '../../lib/common/FS';

export class RoomRequest {
  static create(buffer: Buffer) {
    return new API().upload<DefaultServerResponse & { roomId: string }>('/room/create', buffer);
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

    return new Promise(resolve => {
      socket.once('connect', () => {
        // After emitting Events.room_kick we should get this response (if the person got kicked).
        socket.on(Events.room_kick_res, obj => {
          Console.error(obj.message);
          process.exit();
        });

        // After emitting Events.room_kick we should get this response (if the server failed to kick).
        socket.on(Events.room_kick_err, obj => {
          Console.error(obj.message);
        });

        // After emitting Events.room_leave we should get this response (if everything went well).
        socket.on(Events.room_leave_res, () => {
          Console.yellow('You have left the room');
        });

        // After emitting Events.room_leave we should get this response (if it failed).
        socket.on(Events.room_leave_err, obj => {
          Console.error(obj.message);
        });

        // If the server asks for our public config read the config and send it back to the server.
        socket.on(Events.public_config, () => {
          Config.get()
            .then(conf => socket.emit(Events.public_config_res, { config: conf.public }))
            .catch(err => socket.emit(Events.public_config_err, 'Failed to get config'));
        });
      });

      // Tell the server we would like to join.
      socket.emit(Events.room_join, roomId);

      resolve(socket);
    });
  }
}
