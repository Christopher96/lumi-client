import chalk from 'chalk';
import { Console } from '../lib/utils/Console';
import { API } from '../api/API';

export const listUsersInRoomCommand = async (roomId: string) => {
  Console.title('All active users in room', roomId);
  const serverResponse = await API.RoomRequest.listUsersInRoom(roomId);
  Console.success(serverResponse.users);
};
