import { folderCreate, fileCreate, fileRemove, folderRemove } from '../src/common/fileSystem';
import { assert } from 'chai';
import fs from 'fs-extra';
import path from 'path';

/**
 * The FileSystem functions are used for handling file operations such as creating, moving and removing files and folders.
 * @author: Michael Arenander
 * Written: 2020-04-21
 */

const folderPath = path.join('/folderTest-DeleteMe');
const filePath = path.join('/folderTest-DeleteMe', 'fileTest-DeleteMe.txt');

console.log('folder: ' + folderPath);
console.log('file: ' + filePath);

/*
 * Testing creation of files and folders:
 */

describe('We shall be able to create files and folders!', function() {
  it('should be able to create a folder', function() {
    // Executing the folder-creation-function:
    folderCreate(folderPath);

    // Verifying that folder exists:
    assert.equal(fs.lstatSync(folderPath).isDirectory(), true);
  });

  it('should be able to create a file', function() {
    // Executing the file-creation-function:
    fileCreate(filePath);

    // Verifying that file exists:
    assert.equal(fs.lstatSync(filePath).isFile(), true);
  });
});

/*
 * Testing deletion of files and folders:
 */

describe('We shall be able to remove files and folders!', function() {
  it('should be able to remove a file', function() {
    // Executing the file-deletion-function:
    //fileRemove(filePath);

    // Verifying that file does not exists:
    assert.equal(fs.existsSync(filePath), false);
  });

  it('should be able to remove a folder', function() {
    // Executing the folder-deletion-function:
    //folderRemove(folderPath);
    // Verifying that file does not exists:
    assert.equal(fs.existsSync(folderPath), false);
  });
});

/*
 * TODO: Testing migration of files and folders:
 */
