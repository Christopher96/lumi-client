import { Console } from '../lib/utils/Console';
import { API } from '../api/API';
import { Events } from '../api/routes/SocketEvents';
import { FS } from '../lib/common/FS';
import { FileEvent, FileEventRequest, IPatch, IFileChange } from '../lib/common/types';
import * as path from 'path';
import { getPassword } from '../lib/common/getPassword';
import inquirer from 'inquirer';
import { listRoomsCommand } from './listRoom';
import { listUsersInRoomCommand } from './listUsersInRoom';
import { setPasswordCommand } from './setPassword';
import { Commands } from './availableCommands';

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
    let quit = false;
    while (!quit) {
      await inquirer
        .prompt([
          {
            type: 'rawlist',
            message: 'Room commands:',
            name: 'command',
            choices: [
              Commands.LIST_USERS,
              Commands.KICK_USERS,
              Commands.SET_ROOM_PASSWORD,
              Commands.CHANGE_HOST,
              Commands.LEAVE_ROOM
            ]
          }
        ])
        .then(async answer => {
          switch (answer.command) {
            case Commands.LEAVE_ROOM:
              quit = true;
              socket.emit(Events.room_leave, roomId);
              break;
            case Commands.LIST_USERS:
              await listUsersInRoomCommand(roomId, socket.id);
              break;
            case Commands.SET_ROOM_PASSWORD:
              await setPasswordCommand(roomId, socket.id);
              break;
            case Commands.CHANGE_HOST:
              await hostTransferPrompt();
              break;
            case Commands.KICK_USERS:
              await kickUserPrompt();
              break;
            default:
              Console.error('Not an available command');
              break;
          }
        });
    }
  });

  async function hostTransferPrompt() {
    const serverResponse = await API.RoomRequest.listUsersInRoom(roomId);
    const users = serverResponse.users.map(info => {
      let str = info.user.id + ' : ' + info.user.username;
      if (info.user.id === socket.id) str + ' (you)';
      if (info.isHost) str + ' - ★';
      return str;
    });
    await inquirer
      .prompt([
        {
          type: 'rawlist',
          message: 'Choose the next host:',
          name: 'option',
          choices: users
        }
      ])
      .then(choice => {
        const indexOfUser = users.indexOf(choice.option);
        const userID = serverResponse.users[indexOfUser].user.id;
        socket.emit(Events.room_new_host, roomId, userID);
      });
  }

  async function kickUserPrompt() {
    const serverResponse = await API.RoomRequest.listUsersInRoom(roomId);
    const users = serverResponse.users
      .filter(info => info.isHost == false)
      .map(info => {
        return info.user.id + ' : ' + info.user.username;
      });
    if (users.length == 0) {
      Console.error('No other users in room');
      return;
    }

    await inquirer
      .prompt([
        {
          type: 'rawlist',
          message: 'Choose a user to kick',
          name: 'option',
          choices: users
        }
      ])
      .then(choice => {
        const answer: string = choice.option;
        const id: string = answer.split(' ')[0];

        socket.emit(Events.room_kick, roomId, id);
      });
  }

  // Tell the server we would like to join.
  socket.emit(Events.room_join, roomId);
};
