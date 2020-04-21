import fs from 'fs-extra';

/**
 * The FileSystem class is used for handling file operations such as creating, moving and removing.
 * @author: Michael Arenander
 * Written: 2020-04-21
 */

export const createFile = (source: string, copy: string): Promise<void> => {
  fs.lstat(source).then(stat => {});
};

export default class File {
  /**
   * The path where the file is located before the operation.
   * For file-creation cases, this is where the file will be created.
   */
  private filePath: string;
  /**
   * A file has a name.
   */
  private name: string;

  public create(filePath): void {}
}
