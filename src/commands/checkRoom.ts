import chalk from 'chalk';
import { Console } from '../lib/utils/Console';
import { API } from '../api/API';

export const checkRoomCommand = async (roomId: string) => {
  Console.title('Checking room with id: ', roomId);
  const serverResponse = await API.RoomRequest.getRoom(roomId);
  Console.success('\n' + serverResponse.message);
};
