import { Console } from '../lib/utils/Console';
import { API } from '../api/API';
import { Events } from '../api/routes/SocketEvents';
import { FS } from '../lib/common/FS';
import { FileEvent, FileEventRequest } from '../lib/common/types';
import * as path from 'path';
import { getPassword } from '../lib/common/getPassword';

export const joinRoomCommand = async (roomId: string, sourceFolderPath: string) => {
  Console.title('Joining room with roomId', roomId);

  const zippedRoom = await API.RoomRequest.downloadRoom(roomId);
  await FS.createShadow(sourceFolderPath, zippedRoom);

  const socket = await API.RoomRequest.joinRoom(roomId, sourceFolderPath);

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

  socket.on(Events.room_file_change_res, async (fileEventRequest: FileEventRequest) => {
    if (fileEventRequest.change.event === FileEvent.FILE_MODIFIED) {
      Console.green(`File patched: ${path.join('.shadow', fileEventRequest.change.path)}`);
    } else {
      Console.green(`File changed: ${path.join('.shadow', fileEventRequest.change.path)}`);
    }
  });

  socket.on(Events.room_file_change_err, (error: { message: string }) => {
    Console.error(error.message);
    process.exit();
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
