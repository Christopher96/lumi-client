import io from 'socket.io-client';
import ShadowDirectoryUpdater from '@src/fs/ShadowDirectoryUpdater';
import Zip from '@src/fs/Zip';
import { NetworkEvent } from '@src/network/networkEvent';
import { FileEvent } from '@src/fs/fileEvent';

export default class ClientSocket {
  private socket: SocketIOClient.Socket;

  constructor(serverUrl: string) {
    this.socket = io(serverUrl, {
      transports: ['websocket']
    });
  }

  public connect(): Promise<void> {
    return new Promise<void>(resolve => {
      this.socket.on(NetworkEvent.CONNECT, () => resolve());
    });
  }

  public disconnect(): void {
    this.socket.disconnect();
  }

  public createRoom(): Promise<string> {
    this.socket.emit(NetworkEvent.CREATE_ROOM);
    return new Promise<string>(resolve => {
      this.socket.once(NetworkEvent.CREATE_ROOM, (roomID: string) => resolve(roomID));
    });
  }

  public joinRoom(roomID: string): Promise<boolean> {
    this.socket.emit(NetworkEvent.JOIN_ROOM, roomID);
    return new Promise<boolean>(resolve => {
      this.socket.once(NetworkEvent.JOIN_ROOM, (couldJoin: boolean) => resolve(couldJoin));
    });
  }

  public exchangeZipFiles(roomID: string, sourceDirectoryPath: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      ShadowDirectoryUpdater.removeShadowDirectory(sourceDirectoryPath)
        .then(() => {
          Zip.zip(sourceDirectoryPath)
            .then((zipData: Buffer) => {
              ShadowDirectoryUpdater.createShadowDirectory(sourceDirectoryPath)
                .then(() => {
                  this.socket.emit(NetworkEvent.ZIP, roomID, zipData);
                  this.socket.once(NetworkEvent.ZIP, (zipData: Buffer) => {
                    ShadowDirectoryUpdater.unzipInShadowDirectory(sourceDirectoryPath, zipData)
                      .then(() => resolve())
                      .catch(err => reject(err));
                  });
                })
                .catch(err => reject(err));
            })
            .catch(err => {
              reject(err);
            });
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  public listenForAndApplyFileChanges(sourceDirectoryPath: string) {
    this.socket.on(NetworkEvent.FILE_CHANGE, (fileEvent: FileEvent, filename: string, fileData?: Buffer) => {
      switch (fileEvent) {
        case FileEvent.FILE_CREATED:
        case FileEvent.FILE_MODIFIED:
          ShadowDirectoryUpdater.writeToFileInShadowDirectory(sourceDirectoryPath, filename, fileData);
          break;
        case FileEvent.DIR_CREATED:
          ShadowDirectoryUpdater.createDirInShadowDirectory(sourceDirectoryPath, filename);
          break;
        case FileEvent.FILE_DELETED:
        case FileEvent.DIR_DELETED:
          ShadowDirectoryUpdater.removeFileFromShadowDirectory(sourceDirectoryPath, filename);
          break;
        default:
          throw new Error('Could not match a switch case in listenAndApplyFileChanges()');
      }
    });
  }

  public sendFileChange(roomID: string, fileEvent: FileEvent, filename: string, fileData?: Buffer) {
    if (fileData) {
      this.socket.emit(NetworkEvent.FILE_CHANGE, roomID, fileEvent, filename, fileData);
    } else {
      this.socket.emit(NetworkEvent.FILE_CHANGE, roomID, fileEvent, filename);
    }
  }
}
