import chalk from 'chalk';
import { Console } from '../lib/utils/Console';
import { API } from '../api/API';
import { FS } from '../lib/common/FS';
import { getPassword } from '../lib/common/getPassword';

export const createRoomCommand = async (obj: any) => {
  const sourceFolderPath = obj ? obj : process.cwd();
  console.log('Step1: ' + obj);
  console.log('Step2: ' + sourceFolderPath);
  Console.title('Creating new room from path', sourceFolderPath);
  const buffer = await FS.zip(sourceFolderPath);
  const serverResponse = await API.RoomRequest.create(buffer);
  const roomID = serverResponse.roomId;
  Console.error(roomID);

  Console.title('Enter a password, or skip by pressing ENTER:');
  const hash: string = await getPassword();
  const serverResponse2 = await API.RoomRequest.createPassword(roomID, hash);
  Console.success(serverResponse2.message, 'Room ID: ' + roomID);
};
