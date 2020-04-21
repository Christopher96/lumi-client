import fs, { createFile } from 'fs-extra';

/**
 * The FileSystem functions are used for handling file operations such as creating, removing and moving files and folders.
 * @author: Michael Arenander
 * Written: 2020-04-21
 */

// to create a file
export const fileCreate = (path: string) => {
  fs.ensureFile(path).catch(err => {
    console.error(err);
  });
};

// to create a folder
export const folderCreate = (path: string) => {
  fs.ensureDir(path).catch(err => {
    console.error(err);
  });
};

// to remove a file
export const fileRemove = (path: string) => {
  fs.remove(path, err => {
    if (err) return console.error(err);
  });
};

// to remove a folder
export const folderRemove = (path: string) => {
  fs.remove(path, err => {
    if (err) return console.error(err);
  });
};
