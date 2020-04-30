import chalk from 'chalk';
import { Console } from '../lib/utils/Console';
import { API } from '../api/API';
import { FS } from '../lib/common/FS';

export const createRoomCommand = async (relativePath: string) => {
  Console.title('Creating new room from path', relativePath);
  const buffer = await FS.zip(relativePath);
  const serverResponse = await API.RoomRequest.create(buffer);
  Console.success('\n' + serverResponse.message, serverResponse.roomId);
};
