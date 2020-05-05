import chalk from 'chalk';
import { Console } from '../lib/utils/Console';
import { API } from '../api/API';

export const listRoomsCommand = async () => {
  Console.title('All current rooms: ');
  const serverResponse = await API.RoomRequest.listRooms();
  Console.success(serverResponse.message);
};
