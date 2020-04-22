import fs from 'fs-extra';

/**
 * The FileSystem functions are used for handling file operations such as creating, removing and moving files and folders.
 * @author: Michael Arenander
 * Written: 2020-04-21
 */

/**
 *
 *
 *
 *
 */

// to create a file
export const fileCreate = (dir: string) => {
  fs.ensureFileSync(dir);
};

// to create a folder
export const folderCreate = (dir: string) => {
  fs.ensureDirSync(dir);
};

// to remove a file
export const fileRemove = (dir: string) => {
  fs.removeSync(dir);
};

// to remove a folder
export const folderRemove = (dir: string) => {
  fs.removeSync(dir);
};
