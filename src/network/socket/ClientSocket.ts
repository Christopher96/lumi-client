import io from 'socket.io-client';
import ShadowDirectoryUpdater from '@src/fs/ShadowDirectoryUpdater';
import Zip from '@src/fs/Zip';
import { NetworkEvent } from '@src/network/socket/networkEvent';
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
      this.socket.once(NetworkEvent.CONNECT, () => resolve());
    });
  }

  public disconnect(): void {
    this.socket.disconnect();
  }

  public createRoom(sourceDirectoryPath: string): Promise<string> {
    this.socket.emit(NetworkEvent.CREATE_ROOM);
    return new Promise<string>((resolve, reject) => {
      this.sendZip(sourceDirectoryPath)
        .then(() => {
          this.socket.once(NetworkEvent.CREATE_ROOM, (roomID: string) => resolve(roomID));
        })
        .catch(err => reject(err));
    });
  }

  public joinRoom(sourceDirectoryPath: string, roomID: string): Promise<boolean> {
    this.socket.emit(NetworkEvent.JOIN_ROOM, roomID);
    return new Promise<boolean>((resolve, reject) => {
      this.socket.once(NetworkEvent.JOIN_ROOM, (couldJoin: boolean) => {
        if (couldJoin) {
          this.receiveZip(sourceDirectoryPath)
            .then(() => {
              resolve();
            })
            .catch(err => reject(err));
        }

        resolve(couldJoin);
      });
    });
  }

  public leaveRoom(): void {
    this.socket.emit(NetworkEvent.LEAVE_ROOM);
    this.socket.off(NetworkEvent.FILE_CHANGE, null);
  }

  public sendZip(sourceDirectoryPath: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      Zip.zip(sourceDirectoryPath)
        .then((zipData: Buffer) => {
          this.socket.emit(NetworkEvent.ZIP, zipData);
          resolve();
        })
        .catch(err => reject(err));
    });
  }

  public receiveZip(sourceDirectoryPath: string) {
    return new Promise<void>((resolve, reject) => {
      ShadowDirectoryUpdater.clearShadowDirectory(sourceDirectoryPath)
        .then(() => {
          this.socket.once(NetworkEvent.ZIP, (zipData: Buffer) => {
            ShadowDirectoryUpdater.unzipInShadowDirectory(sourceDirectoryPath, zipData)
              .then(() => {
                resolve();
              })
              .catch(err => reject(err));
          });
        })
        .catch(err => reject(err));
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
