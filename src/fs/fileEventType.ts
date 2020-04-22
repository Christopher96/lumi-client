/**
 * This is a list of all different file events that can occur.
 * To move or rename a file we can simply combine FILE_DELETED and FILE_CREATED.
 */
export enum FileEventType {
  FILE_CREATED = 'add',
  FILE_MODIFIED = 'change',
  FILE_DELETED = 'unlink',
  DIR_CREATED = 'addDir',
  DIR_DELETED = 'unlinkDir'
}
