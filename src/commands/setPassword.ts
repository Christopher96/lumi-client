import { Console } from '../lib/utils/Console';
import { API } from '../api/API';
import { FS } from '../lib/common/FS';
import { getPassword } from '../lib/common/getPassword';

export const setPasswordCommand = async (roomId: string, userID: string) => {
  Console.title('Enter a new password for the room:');
  const hash: string = await getPassword();
  const serverResponse = await API.RoomRequest.setPassword(roomId, userID, hash);
  if (serverResponse.ok) Console.success(serverResponse.message, roomId);
  else Console.error(serverResponse.message);
};
