// Class interfaces
export interface EventHandler {
  addEvents: () => void;
}

// Specification of socket payloads
export interface User {
  id: string;
}

export interface Room {
  id: string;
  source: string;
}

export interface IChunk {
  source: string;
  progress: number;
  done: boolean;
  data: Buffer;
}

export interface Patch {
  room: Room;
  diffs: Diff.ParsedDiff[];
}

export interface Message {
  fromUser: User;
  targetUser: User;
  message: string;
}

export interface IRoom {
  id: string;
  roomFolderPath: string;
  sourceFolderPath: string;
}
