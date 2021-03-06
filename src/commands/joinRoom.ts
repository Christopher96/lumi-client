import { Console } from '../lib/utils/Console';
import { API } from '../api/API';
import { Events } from '../api/routes/SocketEvents';
import { FS } from '../lib/common/FS';
import { FileEvent, FileEventRequest, IPatch, IFileChange } from '../lib/common/types';
import * as path from 'path';
import { getPassword } from '../lib/utils/getPassword';
import inquirer from 'inquirer';
import { listUsersInRoomCommand } from './listUsersInRoom';
import { setRoomPasswordCommand } from './setRoomPassword';
import { Commands } from './availableCommands';

export const joinRoomCommand = async (roomId: string, sourceFolderPath: string) => {
  Console.title('Joining room with roomId', roomId);

  const { ok } = await API.RoomRequest.getRoom(roomId);

  if (!ok) {
    Console.error(`The room ${roomId} doesn't exist`);
    process.exit();
  }

  let isHost = false;
  let displayLogs = false;

  const socket = await API.RoomRequest.createSocket();

  socket.on(Events.room_file_change_res, async (fileEventRequest: FileEventRequest) => {
    let fileEventType = '';
    if (fileEventRequest.change.event === FileEvent.FILE_MODIFIED) {
      fileEventType = 'patched';
      const patch = fileEventRequest.change as IPatch;
      await FS.applyPatches(sourceFolderPath, patch);
    } else {
      fileEventType = 'changed';
      const fileChange = fileEventRequest.change as IFileChange;
      await FS.applyFileChange(sourceFolderPath, fileChange);
    }
    if (displayLogs) {
      Console.green(
        `File ${fileEventType}: ${path.join('.shadow', fileEventRequest.change.path)} by ${fileEventRequest.userId}`
      );
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
    const hash = await getPassword(obj.message);
    socket.emit(Events.room_join, roomId, hash);
  });

  socket.on(Events.room_new_host_res, obj => {
    if (obj.host) {
      isHost = true;
      Console.success(obj.message);
    } else {
      isHost = false;
      Console.yellow(obj.message);
    }
  });

  socket.on(Events.room_new_host_err, err => {
    Console.error(err);
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

    const users = await API.RoomRequest.listUsersInRoom(roomId);
    users.users.forEach(info => {
      if (info.isHost) {
        info.user.id == socket.id ? (isHost = true) : (isHost = false);
      }
    });

    Console.success(obj.message);

    // Experiment starts HERE
    let quit = false;
    while (!quit) {
      let listOfCommands;
      if (isHost) {
        listOfCommands = [
          Commands.LIST_USERS,
          Commands.KICK_USERS,
          Commands.SET_ROOM_PASSWORD,
          Commands.CHANGE_HOST,
          Commands.SEE_LOGS,
          Commands.LEAVE_ROOM
        ];
      } else {
        listOfCommands = [Commands.LIST_USERS, Commands.SEE_LOGS, Commands.LEAVE_ROOM];
      }

      await inquirer
        .prompt([
          {
            type: 'rawlist',
            message: 'Room commands:',
            name: 'command',
            choices: listOfCommands
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
              await setRoomPasswordCommand(roomId, socket.id);
              break;
            case Commands.CHANGE_HOST:
              await hostTransferPrompt();
              break;
            case Commands.KICK_USERS:
              await kickUserPrompt();
              break;
            case Commands.SEE_LOGS:
              await seeLogsPrompt();
              break;
            default:
              Console.error('Not an available command');
              break;
          }
        });
    }
  });

  async function seeLogsPrompt() {
    displayLogs = true;
    await inquirer
      .prompt([
        {
          type: 'input',
          message: 'Press ENTER to exit logs feed.\n',
          name: 'input'
        }
      ])
      .then(pressed => {
        displayLogs = false;
      });
  }

  async function hostTransferPrompt() {
    const serverResponse = await API.RoomRequest.listUsersInRoom(roomId);
    const users = serverResponse.users.map(info => {
      let str = info.user.id + ' : ' + info.user.username;
      if (info.user.id === socket.id) str += ' (you)';
      if (info.isHost) str += ' - ★';
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
        return new Promise((res, rej) => {
          socket.once(Events.room_new_host_res, newHostId => {
            res();
          });
        });
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
