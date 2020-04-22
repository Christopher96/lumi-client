import { folderCreate, fileCreate, fileRemove, folderRemove } from '../src/common/fileSystem';
import { assert } from 'chai';
import fs from 'fs-extra';

/**
 * The FileSystem functions are used for handling file operations such as creating, moving and removing files and folders.
 * @author: Michael Arenander
 * Written: 2020-04-21
 */

/*
 * Picking relative directories within the project to use for folder and file tests.
 * process.cwd() returns the global path to the "lumi-client"-folder.
 */
const folderPath = process.cwd() + '/folderTest-DeleteMe';
const filePath = process.cwd() + '/folderTest-DeleteMe/fileTest-DeleteMe.txt';

/*
 * Checking that the files and folders were created:
 */
describe('We shall be able to create files and folders!', function() {
  it('should have created a folder', function() {
    /*
     * Executing the folder-creation-function:
     */
    folderCreate(folderPath);
    /*
     * Verifying that folder exists:
     */
    assert.equal(fs.lstatSync(folderPath).isDirectory(), true);
  });

  it('should have created a file', function() {
    /*
     * Executing the file-creation-function:
     */
    fileCreate(filePath);
    /*
     * Verifying that file exists:
     */
    assert.equal(fs.lstatSync(filePath).isFile(), true);
  });
});

/*
 * Testing deletion of files and folders:
 */

describe('We shall be able to remove files and folders!', function() {
  it('should remove a file', function() {
    /*
     * Executing the file-deletion-function:
     */
    fileRemove(filePath);
    /*
     * Verifying that file does not exists:
     */
    assert.equal(fs.existsSync(filePath), false);
  });

  it('should remove a folder', function() {
    /*
     * Executing the folder-deletion-function:
     */
    folderRemove(folderPath);
    /*
     * Verifying that file does not exists:
     */
    assert.equal(fs.existsSync(folderPath), false);
  });
});

/*
 * TODO: Testing migration of files and folders:
 */
