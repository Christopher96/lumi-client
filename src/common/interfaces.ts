import { FileEventType } from '@src/fs/fileEventType';

// Class interfaces
export interface EventHandler {
  addEvents: () => void;
}

export interface IUser {
  id: string;
}

export interface Chunk {
  progress: number;
  done: boolean;
  data: Buffer;
}

export interface IChunk {
  chunk: Chunk;
  room: IRoom;
}

export interface IPatch {
  room: IRoom;
  diffs: Diff.ParsedDiff[];
}

export interface IMessage {
  fromUser: IUser;
  targetUser: IUser;
  message: string;
}

export interface FileChange {
  event: FileEventType;
  relativePath: string;
  data?: Buffer;
}

export interface IFileChange {
  fileChange: FileChange;
  room: IRoom;
}

export interface IRoom {
  id: string;
  shadowFolderPath: string;
  roomFolderPath: string;
  sourceFolderPath: string;
}
