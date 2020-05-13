import chalk from 'chalk';
import { Console } from '../lib/utils/Console';
import { API } from '../api/API';

export const listUsersInRoomCommand = async (roomId: string) => {
  const serverResponse = await API.RoomRequest.listUsersInRoom(roomId);
  if (serverResponse.ok) {
    Console.success(serverResponse.message);
    serverResponse.users.forEach(user => {
      //console.log(user.isHost);
      //console.log('user: ' + user);
      //console.log('user.user' + user.user);
      // console.log(user.user.id);
      const userInfo = user.user;

      if (user.isHost) {
        Console.success(`Host : ${userInfo.id} : ${userInfo.username}`);
      } else {
        Console.success(`${userInfo.id} : ${userInfo.username}`);
      }
    });
  } else {
    Console.error(serverResponse.message);
  }
};
