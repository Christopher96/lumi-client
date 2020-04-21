import fs from 'fs-extra';

/**
 * The FileSystem class is used for handling file operations such as creating, moving and removing.
 * @author: Michael Arenander
 * Written: 2020-04-21
 */

export const createFile = (path: string) => {
  fs.ensureDir(path)
    .then(() => {
      console.log('success!');
    })
    .catch(err => {
      console.error(err);
    });
};
