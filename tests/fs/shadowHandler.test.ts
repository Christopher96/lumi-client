import { assert } from 'chai';
import fs from 'fs-extra';
import path from 'path';
import { ShadowHandler } from '../../src/fs/shadowHandler';
import { FileEventType } from '../../src/fs/fileEventType';

/**
 * The FileSystem functions are used for handling file operations such as creating, moving and removing files and folders.
 * @author Michael Arenander
 * @date 2020-04-22
 */

describe('We shall be able to handle shadow-file changes', function() {
  const shadowTest = new ShadowHandler('test-repo');
  const testFolderPath = path.join(shadowTest.getShadowFolder(), 'test-folder1');
  const testFilePath = path.join(shadowTest.getShadowFolder(), 'test-file1');

  it('shadowHandler should exist', function() {
    assert.exists(shadowTest);
  });

  it('should be able to add a new folder', function() {
    shadowTest.update(FileEventType.DIR_CREATED, 'test-folder1');
    assert.equal(fs.lstatSync(testFolderPath).isDirectory(), true);
  });

  it('should be able to delete a folder', function() {
    shadowTest.update(FileEventType.DIR_DELETED, 'test-folder1');
    assert.equal(fs.existsSync(testFolderPath), false);
  });

  it('should be able to add a new file', function() {
    shadowTest.update(FileEventType.FILE_CREATED, 'test-file1', '');
    assert.equal(fs.lstatSync(testFilePath).isDirectory(), false);
  });

  it('should be able to modify a new file', function() {
    assert.equal(fs.readFileSync(testFilePath).toString(), '');
    shadowTest.update(FileEventType.FILE_MODIFIED, 'test-file1', 'test123');
    assert.equal(fs.lstatSync(testFilePath).isDirectory(), false);
    assert.equal(fs.readFileSync(testFilePath).toString(), 'test123');
  });

  it('should be able to delete a file', function() {
    shadowTest.update(FileEventType.FILE_DELETED, 'test-file1');
    assert.equal(fs.existsSync(testFilePath), false);
  });
});
