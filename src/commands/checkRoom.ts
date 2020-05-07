import { Console } from '../lib/utils/Console';
import { API } from '../api/API';

export const checkRoomCommand = async (roomId: string) => {
  Console.title('Checking room with id: ', roomId);
  const serverResponse = await API.RoomRequest.getRoom(roomId);
  if (serverResponse.ok) {
    Console.success(`${serverResponse.message}`);
    Console.success(`${serverResponse.room.id} : ${serverResponse.room.socketCount}`);
  } else {
    Console.error(serverResponse.message);
  }
};
