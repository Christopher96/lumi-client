import fs from 'fs-extra';

/**
 * The FileSystem functions are used for handling file operations such as creating, removing and moving files and folders.
 * @author: Michael Arenander
 * Written: 2020-04-21
 */

// to create a file
export const fileCreate = (path: string) => {
  fs.ensureFileSync(path);
};

// to create a folder
export const folderCreate = (path: string) => {
  fs.ensureDirSync(path);
};

// to remove a file
export const fileRemove = (path: string) => {
  fs.removeSync(path);
};

// to remove a folder
export const folderRemove = (path: string) => {
  fs.removeSync(path);
};
