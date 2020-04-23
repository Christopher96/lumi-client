// Class interfaces
export interface EventHandler {
  addEvents: () => void;
}

// Specification of socket payloads
export interface IUser {
  id: string;
}

export interface IChunk {
  source: string;
  progress: number;
  done: boolean;
  data: Buffer;
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

export interface IRoom {
  id: string;
  roomFolderPath: string;
  sourceFolderPath: string;
}
