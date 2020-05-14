import { Console } from '../lib/utils/Console';
import { API } from '../api/API';
import { FS } from '../lib/common/FS';
import { getPassword } from '../lib/utils/getPassword';

export const createRoomCommand = async (sourceFolderPath: string) => {
  Console.title('Creating new room from path', sourceFolderPath);
  const buffer = await FS.zip(sourceFolderPath);
  const serverResponse = await API.RoomRequest.create(buffer);
  const roomID = serverResponse.roomId;

  const hash: string = await getPassword('Enter a password, or skip by pressing ENTER:');
  const serverResponse2 = await API.RoomRequest.createPassword(roomID, hash);
  Console.success(serverResponse2.message, 'Room ID: ' + roomID);
};
