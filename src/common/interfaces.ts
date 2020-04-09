// Specification of socket payloads
export interface User {
  id: string;
}

// TODO Add proper typing of ID
export interface Room {
  id: string;
  source: string;
}

export interface Chunk {
  path: string;
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
