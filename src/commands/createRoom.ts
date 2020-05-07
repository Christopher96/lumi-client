import chalk from 'chalk';
import { Console } from '../lib/utils/Console';
import { API } from '../api/API';
import { FS } from '../lib/common/FS';
import { getPassword } from '../lib/common/getPassword';

export const createRoomCommand = async (sourceFolderPath: string) => {
  Console.title('Creating new room from path', sourceFolderPath);
  const buffer = await FS.zip(sourceFolderPath);
  // generate random token based on timestamp
  const serverResponse = await API.RoomRequest.create(buffer);
  const roomID = serverResponse.roomId;

  Console.title('Enter a password for the room:');
  const hash: string = await getPassword();
  const serverResponse2 = await API.RoomRequest.createPassword(roomID, hash);
  Console.success('\n' + serverResponse2.message, 'Room ID: ' + roomID);
};
