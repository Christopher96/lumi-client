import { Console } from '../lib/utils/Console';
import { API } from '../api/API';
import { Events } from '../api/routes/SocketEvents';
import { FS } from '../lib/common/FS';
import { FileEvent, FileEventRequest, IPatch, IFileChange } from '../lib/common/types';
import * as path from 'path';
import { getPassword } from '../lib/common/getPassword';

export const joinRoomCommand = async (roomId: string, sourceFolderPath: string) => {
  Console.title('Joining room with roomId', roomId);

  const { ok } = await API.RoomRequest.getRoom(roomId);

  if (!ok) {
    Console.error(`The room ${roomId} doesn't exist`);
    process.exit();
  }

  const zippedRoom = await API.RoomRequest.downloadRoom(roomId);
  await FS.createShadow(sourceFolderPath, zippedRoom);

  const socket = await API.RoomRequest.createSocket();

  FS.listenForLocalFileChanges(sourceFolderPath, (fileChange: IFileChange) => {
    socket.emit(Events.room_file_change, { change: fileChange, roomId });
  });
  FS.listenForLocalPatches(sourceFolderPath, (patch: IPatch) => {
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

  socket.on(Events.room_file_change_err, (err: { message: string } | FileEventRequest) => {
    const event = err as FileEventRequest;
    if (!event) {
      Console.error((err as { message: string }).message);
      process.exit();
    } else {
      Console.error(`The server could not apply the file change you made to: ${event.change.path}`);
    }
  });

  socket.on(Events.room_join_err, obj => {
    Console.error(obj.message);
    process.exit();
  });

  socket.on(Events.room_join_auth, async obj => {
    Console.title(obj.message);
    const hash = await getPassword();
    socket.emit(Events.room_join_auth, { roomId, hash });
  });

  socket.on(Events.room_join_res, obj => {
    Console.success(obj.message);
  });

  // Tell the server we would like to join.
  socket.emit(Events.room_join, roomId);
};
