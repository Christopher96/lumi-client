import fs from 'fs-extra';
import { FileEventType } from './fileEventType';
import path from 'path';

/**
 * The FileSystem functions are used for handling file operations such as creating, removing and moving files and folders.
 * @author: Michael Arenander
 * Written: 2020-04-21
 */

export class ShadowHandler {
  private shadowFolder;

  constructor(sourceFolder: string) {
    console.log('Shadow Handler');
    this.shadowFolder = path.join(sourceFolder, '.shadow');
    fs.ensureDirSync(this.shadowFolder);
  }

  /**
   *
   * @param event
   * @param path example: 'src/index.ts'
   */
  public update(event: FileEventType, relativePath: string, fileContent?: string): void {
    switch (event) {
      case FileEventType.FILE_CREATED:
      case FileEventType.FILE_MODIFIED:
        fs.writeFileSync(path.join(this.shadowFolder, relativePath), fileContent);
        break;
      case FileEventType.DIR_CREATED:
        fs.ensureDirSync(path.join(this.shadowFolder, relativePath));
        break;
      case FileEventType.FILE_DELETED:
      case FileEventType.DIR_DELETED:
        fs.removeSync(path.join(this.shadowFolder, relativePath));
        break;
      default:
        console.error('Error!');
        break;
    }
  }

  public getShadowFolder(): string {
    return this.shadowFolder;
  }
}

const shadowTest = new ShadowHandler('test-repo');

shadowTest.update(FileEventType.DIR_CREATED, 'test-folder1');
shadowTest.update(FileEventType.DIR_DELETED, 'test-folder1');
