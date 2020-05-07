import { Console } from '../lib/utils/Console';
import { API } from '../api/API';
import { Events } from '../api/routes/SocketEvents';
import { FS } from '../lib/common/FS';
import { FileEvent, FileEventRequest } from '../lib/common/types';
import * as path from 'path';
import { IFileChange } from '../lib/common/types';
import { IPatch } from '../lib/common/types';

export const joinRoomCommand = async (roomId: string, sourceFolderPath: string) => {
  Console.title('Joining room with roomId', roomId);

  const socket = await API.RoomRequest.joinRoom(roomId);

  const zippedRoom = await API.RoomRequest.downloadRoom(roomId);

  await FS.createShadow(sourceFolderPath, zippedRoom);

  const onError = (error: { roomExist: boolean; message: string }) => {
    if (!error.roomExist) {
      Console.error(error.message);
      process.exit();
    }
  };

  FS.listenForLocalFileChanges(sourceFolderPath, (fileChange: IFileChange) => {
    socket.emit(Events.room_file_change, { change: fileChange, roomId });
  });

  FS.listenForLocalPatches(sourceFolderPath, (patch: IPatch) => {
    socket.emit(Events.room_file_change, { change: patch, roomId });
  });

  socket.on(Events.room_file_change_res, async (fileEventRequest: FileEventRequest) => {
    if (fileEventRequest.change.event === FileEvent.FILE_MODIFIED) {
      const patch = fileEventRequest.change as IPatch;
      try {
        await FS.applyPatches(sourceFolderPath, patch);
      } catch (err) {
        Console.error(err);
      }
    } else {
      const fileChange = fileEventRequest.change as IFileChange;
      try {
        await FS.applyFileChange(sourceFolderPath, fileChange);
      } catch (err) {
        Console.error(err);
      }
    }
  });

  socket.on(Events.room_file_change_err, (roomExist: boolean, fileEventRequest: FileEventRequest) => {
    if (roomExist) {
      Console.error(`The server could not apply your file change on: ${fileEventRequest.change.path}`);
      Console.error('Please compare your file to the same file in the shadow folder');
    }
  });

  socket.on(Events.room_file_change_err, onError);
};
