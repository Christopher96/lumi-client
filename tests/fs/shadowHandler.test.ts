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

describe('We shall be able to add, modify and delete files and folders with the ShadowHandler', function() {
  const sh = new ShadowHandler('test-repo');

  it('shadowHandler should exist', function() {
    assert.exists(sh);
  });

  /**
   * The recusriveFSTest-function creates a directory with many folders and files recursively and then removes every item to test that the system behaves correctly.
   * @param shadowDir is the path to the folder which will be populated by the function.
   * @param isFile is a boolean, if true: creates a file, if false: creates a folder.
   * @param count is a countdown to limit the size of the test.
   */
  const recursiveFSTest = (shadowDir: string, isFile: boolean, count: number) => {
    // end case is when count is not more than 0
    if (count > 0) {
      // local variables for each file/folder item
      const name = 'test' + count;
      const fromShadowDir = path.join(shadowDir, name);
      const fromRootDir = path.join(sh.getShadowFolder(), fromShadowDir);

      if (isFile) {
        // add a new file
        it('should be able to add a new file: ' + name, function(done) {
          sh.update(FileEventType.FILE_CREATED, fromShadowDir, '').then(() => {
            assert.equal(fs.lstatSync(fromRootDir).isDirectory(), false);
            done();
          });
        });

        // modify this new file
        it('should be able to modify a new file: ' + name, function(done) {
          assert.equal(fs.readFileSync(fromRootDir).toString(), '');
          sh.update(FileEventType.FILE_MODIFIED, fromShadowDir, 'test hej_' + count).then(() => {
            assert.equal(fs.lstatSync(fromRootDir).isDirectory(), false);
            assert.equal(fs.readFileSync(fromRootDir).toString(), 'test hej_' + count);
            done();
          });
        });

        // add more files in the same folder as this new file
        recursiveFSTest(shadowDir, count < 5, --count);

        // delete this new file
        it('should be able to delete a file: ' + name, function(done) {
          sh.update(FileEventType.FILE_DELETED, fromShadowDir).then(() => {
            assert.equal(fs.existsSync(fromRootDir), false);
            done();
          });
        });
      } else {
        // add a new folder
        it('should be able to add a new folder: ' + name, function(done) {
          sh.update(FileEventType.DIR_CREATED, fromShadowDir).then(() => {
            assert.equal(fs.lstatSync(fromRootDir).isDirectory(), true);
            done();
          });
        });

        // populate this new folder with more data
        recursiveFSTest(fromShadowDir, count < 5, --count);
        recursiveFSTest(fromShadowDir, true, --count);

        // delete this folder
        it('should be able to delete a folder: ' + name, function(done) {
          sh.update(FileEventType.DIR_DELETED, fromShadowDir).then(() => {
            assert.equal(fs.existsSync(fromRootDir), false);
            done();
          });
        });
      }
    }
  };

  // recursive test function for the shadow handler is executed here:
  recursiveFSTest('', false, 7);

  after('removing the .shadow folder', function() {
    fs.removeSync(sh.getShadowFolder());
  });
});
