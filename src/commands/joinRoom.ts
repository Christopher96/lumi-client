import { Console } from '../lib/utils/Console';
import { API } from '../api/API';
import { Events } from '../api/routes/SocketEvents';
import { FS } from '../lib/common/FS';
import { FileEvent, IPatch, FileEventRequest } from '../lib/common/types';
import * as path from 'path';

export const joinRoomCommand = async (roomId: string) => {
  Console.title('Joining room with roomId', roomId);

  const relativePath = './';
  const socket = await API.RoomRequest.joinRoom(roomId);

  const zippedRoom = await API.RoomRequest.downloadRoom(roomId);
  await FS.createShadow(relativePath, zippedRoom);

  const onError = (error: { message: string }) => {
    Console.error(error.message);
    process.exit();
  };

  const onFilePatch = (patch: FileEventRequest) => {
    FS.handleEvent(patch.patch);
  };

  const onLocalChange = (patch: IPatch) => {
    const obj: FileEventRequest = {
      patch,
      roomId
    };
    socket.emit(Events.room_file_change, obj);
  };

  FS.subscribeToChange(relativePath, onLocalChange);
  FS.subscribeToCreate(relativePath, onLocalChange);

  socket.on(Events.room_file_change_res, onFilePatch);
  socket.on(Events.room_file_change_err, onError);
};
