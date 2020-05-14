import chalk from 'chalk';
import { Console } from '../lib/utils/Console';
import { API } from '../api/API';

export const listUsersInRoomCommand = async (roomId: string, you?: string) => {
  const serverResponse = await API.RoomRequest.listUsersInRoom(roomId);
  if (serverResponse.ok) {
    Console.success(serverResponse.message);
    serverResponse.users.forEach(user => {
      const userInfo = user.user;
      if (user.isHost)
        Console.success(`${userInfo.id} : ${userInfo.username} ${you == userInfo.id ? '(you) ' : ''}- ★`);
      else Console.success(`${userInfo.id} : ${userInfo.username} ${you == userInfo.id ? '(you)' : ''}`);
    });
  } else {
    Console.error(serverResponse.message);
  }
};
