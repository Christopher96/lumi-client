import { IConfig } from '../utils/Config';

export enum FileEvent {
  FILE_CREATED = 'add',
  FILE_MODIFIED = 'change',
  FILE_DELETED = 'unlink',
  DIR_CREATED = 'addDir',
  DIR_DELETED = 'unlinkDir'
}

export interface IFileChange {
  event: FileEvent;
  path: string;
  buffer?: Buffer;
}

export interface IPatch {
  diffs?: Diff.ParsedDiff[];
  event: FileEvent;
  buffer?: Buffer;
  path: string;
}

export interface FileEventRequest {
  change: IPatch | IFileChange;
  roomId: string;
  userId: string;
}

export type Tree = Leaf | Branch;

export type Leaf = {
  title: string;
  key: string;
  isLeaf: true;
};

export type Branch = {
  title: string;
  key: string;
  isLeaf: false;
  children: Tree[];
};

export type User = IConfig & {
  id: string;
};

export type RoomChangedEvent = {
  users: User[];
  message: string;
  newUser: User;
};
