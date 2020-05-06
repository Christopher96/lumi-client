import { API, DefaultServerResponse } from '../API';
import io from 'socket.io-client';
import { Events } from './SocketEvents';
import { Config } from '../../lib/utils/Config';
import { FS } from '../../lib/common/FS';
import { FileEvent, IFileChange, IPatch, FileEventRequest } from '../../lib/common/types';

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

  static joinRoom(roomId: string, sourceFolderPath: string): Promise<SocketIOClient.Socket> {
    // Create the server instance with the server
    const socket = io(process.env.SERVER_ENDPOINT, {
      transports: ['websocket']
    });

    return new Promise(resolve => {
      socket.once('connect', () => {
        socket.on(Events.room_file_change_res, async (fileEventRequest: FileEventRequest) => {
          if (fileEventRequest.change.event === FileEvent.FILE_MODIFIED) {
            const patch = fileEventRequest.change as IPatch;
            await FS.applyPatches(sourceFolderPath, patch);
          } else {
            const fileChange = fileEventRequest.change as IFileChange;
            await FS.applyFileChange(sourceFolderPath, fileChange);
          }
        });

        // If the server asks for our public config read the config and send it back to the server.
        socket.on(Events.public_config, () => {
          Config.get()
            .then(conf => socket.emit(Events.public_config_res, { config: conf.public }))
            .catch(err => socket.emit(Events.public_config_err, 'Failed to get config'));
        });

        FS.listenForLocalFileChanges(sourceFolderPath, (fileChange: IFileChange) => {
          socket.emit(Events.room_file_change, { change: fileChange, roomId });
        });
        FS.listenForLocalPatches(sourceFolderPath, (patch: IPatch) => {
          socket.emit(Events.room_file_change, { change: patch, roomId });
        });

        resolve(socket);
      });
    });
  }
}
