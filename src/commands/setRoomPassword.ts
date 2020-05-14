import { Console } from '../lib/utils/Console';
import { API } from '../api/API';
import { getPassword } from '../lib/utils/getPassword';

export const setRoomPasswordCommand = async (roomId: string, userID: string) => {
  const hash: string = await getPassword('Enter a new password for the room:');
  const serverResponse = await API.RoomRequest.setPassword(roomId, userID, hash);
  if (serverResponse.ok) Console.success(serverResponse.message, roomId);
  else Console.error(serverResponse.message);
};
