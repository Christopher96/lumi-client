import { Console } from '../lib/utils/Console';
import { API } from '../api/API';
import { getPassword } from '@src/lib/common/getPassword';

export const setRoomPasswordCommand = async (roomId: string, userID: string, password: string) => {
  Console.title('Enter a new password for the room:');
  const hash = await getPassword();
  const serverResponse = await API.RoomRequest.setPassword(roomId, userID, hash);
  Console.success(serverResponse.message, roomId);
};
