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

  const onError = (error: { message: string }) => {
    Console.error(error.message);
    process.exit();
  };

  FS.listenForLocalFileChanges(sourceFolderPath, (fileChange: IFileChange) => {
    socket.emit(Events.room_file_change, { change: fileChange, roomId });
  });
  FS.listenForLocalFileChanges(sourceFolderPath, (patch: IPatch) => {
    socket.emit(Events.room_file_change, { change: patch, roomId });
  });

  socket.on(Events.room_file_change_res, async (fileEventRequest: FileEventRequest) => {
    if (fileEventRequest.change.event === FileEvent.FILE_MODIFIED) {
      Console.green(`File patched: ${path.join('.shadow', fileEventRequest.change.path)}`);
      const patch = fileEventRequest.change as IPatch;
      await FS.applyPatches(sourceFolderPath, patch);
    } else {
      Console.green(`File changed: ${path.join('.shadow', fileEventRequest.change.path)}`);
      const fileChange = fileEventRequest.change as IFileChange;
      await FS.applyFileChange(sourceFolderPath, fileChange);
    }
  });

  socket.on(Events.room_file_change_err, onError);
};
