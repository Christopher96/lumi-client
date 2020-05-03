import { Console } from '../lib/utils/Console';
import { FS } from '../lib/common/FS';
import { API } from '../api/API';
import { joinRoomCommand } from './joinRoom';

export const startCommand = async (sourceFolderPath: string) => {
  Console.title('Running start on', sourceFolderPath);

  const buffer = await FS.zip(sourceFolderPath);
  const serverResponse = await API.RoomRequest.create(buffer);
  Console.success('\n' + serverResponse.message, serverResponse.roomId);

  return joinRoomCommand(serverResponse.roomId, sourceFolderPath);
};
