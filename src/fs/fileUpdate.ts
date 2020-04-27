import fs from 'fs-extra';
import { FileEventType } from './fileEventType';
import path from 'path';
import { FileChange } from '../common/interfaces';

/**
 * Used both on the server and client to update a file in the room folder / source folder.
 */
export default class FileUpdate {
  /**
   * The update method should be called when a file change has been received.
   */
  public static update(folderPath: string, fileChange: FileChange): Promise<void> {
    const operationPath = path.join(folderPath, fileChange.relativePath);

    // Runs the appropriate file operation.
    switch (fileChange.event) {
      case FileEventType.FILE_CREATED:
        return new Promise<void>((resolve, reject) => {
          fs.writeFile(operationPath, fileChange.data, err => {
            if (err) reject(err);
            else resolve();
          });
        });
      case FileEventType.FILE_MODIFIED:
        // TODO: Handle patches here.
        break;
      case FileEventType.DIR_CREATED:
        return fs.ensureDir(operationPath);
      case FileEventType.FILE_DELETED:
      case FileEventType.DIR_DELETED:
        return new Promise<void>((resolve, reject) => {
          fs.remove(operationPath, err => {
            if (err) reject(err);
            else resolve();
          });
        });
      default:
        return new Promise((resolve, reject) => {
          reject(new Error(`Could not update file ${fileChange.relativePath} in the folder: ${folderPath}.`));
        });
    }
  }
}
