import chalk from 'chalk';
import { Console } from '../lib/utils/Console';
import { API } from '../api/API';

export const listUsersInRoomCommand = async (roomId: string) => {
  const serverResponse = await API.RoomRequest.listUsersInRoom(roomId);
  if (serverResponse.ok) {
    Console.success(serverResponse.message);
    serverResponse.users.forEach(user => {
      Console.success(`${user.id} : ${user.username}`);
    });
  } else {
    Console.error(serverResponse.message);
  }
};
