import { Console } from '../lib/utils/Console';
import { FS } from '../lib/common/FS';
import { API } from '../api/API';
import { joinRoomCommand } from './joinRoom';

export const startCommand = async (relativePath: string) => {
  Console.title('Running start on', relativePath);

  const buffer = await FS.zip(relativePath);
  const serverResponse = await API.RoomRequest.create(buffer);
  Console.success('\n' + serverResponse.message, serverResponse.roomId);

  return joinRoomCommand(serverResponse.roomId);
};
