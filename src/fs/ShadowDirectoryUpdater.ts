import fs from 'fs-extra';
import path from 'path';
import Zip from '@src/fs/Zip';

export default class ShadowDirectoryUpdater {
  public static clearShadowDirectory(sourceDirectoryPath: string): Promise<void> {
    return fs.emptyDir(path.join(sourceDirectoryPath, '.shadow'));
  }

  public static unzipInShadowDirectory(sourceDirectoryPath: string, buffer: Buffer): Promise<void> {
    return Zip.unzip(path.join(sourceDirectoryPath, '.shadow'), buffer);
  }

  public static writeToFileInShadowDirectory(
    sourceDirectoryPath: string,
    filename: string,
    fileData: Buffer
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      fs.writeFile(path.join(sourceDirectoryPath, '.shadow', filename), fileData, { flag: 'w' }, err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  public static removeFileFromShadowDirectory(sourceDirectoryPath: string, filename: string): Promise<void> {
    return fs.remove(path.join(sourceDirectoryPath, '.shadow', filename));
  }

  public static createDirInShadowDirectory(sourceDirectoryPath: string, directoryPath: string): Promise<void> {
    return fs.ensureDir(path.join(sourceDirectoryPath, '.shadow', directoryPath));
  }
}
