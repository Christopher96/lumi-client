import { Console } from '../lib/utils/Console';
import { API } from '../api/API';
import { Events } from '../api/routes/SocketEvents';
import { FS } from '../lib/common/FS';
import { FileEvent, FileEventRequest, IPatch, IFileChange } from '../lib/common/types';
import * as path from 'path';
import { getPassword } from '../lib/common/getPassword';
import readline from 'readline';
import { listRoomsCommand } from './listRoom';
import { listUsersInRoomCommand } from './listUsersInRoom';
import { setPasswordCommand } from './setPassword';

export const joinRoomCommand = async (roomId: string, sourceFolderPath: string) => {
  Console.title('Joining room with roomId', roomId);

  const { ok } = await API.RoomRequest.getRoom(roomId);

  if (!ok) {
    Console.error(`The room ${roomId} doesn't exist`);
    process.exit();
  }

  const socket = await API.RoomRequest.createSocket();

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
    process.exit();
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

  socket.on(Events.room_join_res, async obj => {
    const zippedRoom = await API.RoomRequest.downloadRoom(roomId);
    await FS.createShadow(sourceFolderPath, zippedRoom);

    FS.listenForLocalFileChanges(sourceFolderPath, (fileChange: IFileChange) => {
      socket.emit(Events.room_file_change, { change: fileChange, roomId });
    });
    FS.listenForLocalPatches(sourceFolderPath, (patch: IPatch) => {
      socket.emit(Events.room_file_change, { change: patch, roomId });
    });

    Console.success(obj.message);

    // Experiment starts HERE
    const rl = readline.createInterface({
      input: process.stdin,
      output: null
    });

    rl.on('line', async line => {
      const args = line.split(' ');
      if (args[0] === 'quit') {
        socket.emit(Events.room_leave, roomId);
        return;
      }

      switch (args[0]) {
        case 'users':
          await listUsersInRoomCommand(roomId);
          break;
        case 'rooms':
          await listRoomsCommand();
          break;
        case 'set':
          if (args[1] === 'password') await setPasswordCommand(roomId, socket.id);
          else if (args[1] === 'host') socket.emit(Events.room_new_host, roomId, args[2]);
          else Console.error('Command: set - Missing argument');
          break;
        case 'kick':
          socket.emit(Events.room_kick, roomId, args[1]);
          break;
        case 'config':
          break;
        default:
          Console.error('Not an available command');
          break;
      }
    });
  });

  // Tell the server we would like to join.
  socket.emit(Events.room_join, roomId);
};
