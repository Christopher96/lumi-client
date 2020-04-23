// Global events for client and server
const enum events {
  SERVER_CONNECT = 'connection',
  CLIENT_CONNECT = 'connect',
  MESSAGE = 'message',
  LIST_USERS = 'list_users',
  LIST_ROOMS = 'list_rooms',
  PATCH = 'patch',
  PATCH_ERR = 'patch_err',
  CREATE_ROOM = 'create_room',
  ROOM_CREATED = 'room_created',
  JOIN_ROOM = 'join_room',
  ROOM_AUTH = 'room_auth',
  UPLOAD_OK = 'upload_ok',
  DOWNLOAD_CHUNK = 'download_chunk',
  DOWNLOAD_ERR = 'download_err'
}

export default events;
