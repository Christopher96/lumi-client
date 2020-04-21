import { folderCreate, fileCreate, fileRemove, folderRemove } from '../src/common/fileSystem';
import { assert } from 'chai';
import fs from 'fs-extra';

/**
 * The FileSystem functions are used for handling file operations such as creating, moving and removing files and folders.
 * @author: Michael Arenander
 * Written: 2020-04-21
 */

describe('We shall be able to manage files!', () => {
  /*
   * Testing creation of files and folders:
   */

  it('Should be able to create a folder', () => {
    /*
     * Picking a relative directory within the project to use.
     * process.cwd() returns the global path to the "lumi-client"-folder.
     */
    const directory = process.cwd() + '/folderTest-DeleteMe';
    /*
     * Executing the folder-creation-function:
     */
    folderCreate(directory);
    /*
     * Verifying that folder exists:
     */
    assert.equal(fs.lstatSync(directory).isDirectory(), true);
  });

  it('Should be able to create a file', () => {
    /*
     * Picking a relative directory within the project to use.
     * process.cwd() returns the global path to the "lumi-client"-folder.
     */
    const directory = process.cwd() + '/folderTest-DeleteMe/FileTest-DeleteMe.txt';
    /*
     * Executing the file-creation-function:
     */
    fileCreate(directory);
    /*
     * Verifying that file exists:
     */
    assert.equal(fs.lstatSync(directory).isFile(), true);
  });

  /*
   * Testing deletion of files and folders:
   */

  it('Should be able to remove a file', () => {
    /*
     * Picking a relative directory within the project to use.
     * process.cwd() returns the global path to the "lumi-client"-folder.
     */
    const directory = process.cwd() + '/folderTest-DeleteMe/test.txt';
    /*
     * Executing the file-deletion-function:
     */
    fileRemove(directory);
    /*
     * Verifying that file does not exists:
     */
    assert.equal(fs.existsSync(directory), false);
  });

  it('Should be able to remove a folder', () => {
    /*
     * Picking a relative directory within the project to use.
     * process.cwd() returns the global path to the "lumi-client"-folder.
     */
    const directory = process.cwd() + '/folderTest-DeleteMe';
    /*
     * Executing the folder-deletion-function:
     */
    folderRemove(directory);
    /*
     * Verifying that file does not exists:
     */
    assert.equal(fs.existsSync(directory), false);
  });
});
