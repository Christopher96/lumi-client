// Global events for client and server
const enum events {
  SERVER_CONNECT = 'connection',
  CLIENT_CONNECT = 'connect',
  MESSAGE = 'message',
  LIST_USERS = 'list_users',
  LIST_ROOMS = 'list_rooms',
  FILE_CHANGE = 'file_change',
  FILE_PATCH = 'file_patch',
  PATCH_ERR = 'patch_err',
  CREATE_ROOM = 'create_room',
  ROOM_CREATED = 'room_created',
  JOIN_ROOM = 'join_room',
  JOIN_ERR = 'join_err',
  JOIN_AUTH = 'join_auth',
  UPLOAD_OK = 'upload_ok',
  UPLOAD_DONE = 'upload_done',
  UPLOAD_ERR = 'upload_err',
  DOWNLOAD_CHUNK = 'download_chunk',
  ECHO = 'echo'
}

export default events;
