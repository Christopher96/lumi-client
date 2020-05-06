import { Console } from '../lib/utils/Console';
import { API } from '../api/API';
import { FS } from '../lib/common/FS';

export const createRoomCommand = async (sourceFolderPath: string) => {
  Console.title('Creating new room from path', sourceFolderPath);
  const buffer = await FS.zip(sourceFolderPath);
  const serverResponse = await API.RoomRequest.create(buffer);
  Console.success('\n' + serverResponse.message, serverResponse.roomId);
};
