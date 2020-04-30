export enum FileEvent {
  FILE_CREATED = 'add',
  FILE_MODIFIED = 'change',
  FILE_DELETED = 'unlink',
  DIR_CREATED = 'addDir',
  DIR_DELETED = 'unlinkDir'
}

export interface IPatch {
  diffs?: Diff.ParsedDiff[];
  event: FileEvent;
  buffer?: Buffer;
  path?: string;
}

export interface FileEventRequest {
  patch: IPatch;
  roomId: string;
}