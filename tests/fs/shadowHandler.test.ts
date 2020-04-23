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

  it('shadowHandler should exist', function() {
    assert.exists(shadowTest);
  });

  /**
   * The recusriveFSTest-function creates a directory with many folders and files recursively and then removes every item to test that the system behaves correctly.
   * @param directory is the path to the folder which will be populated by the function.
   * @param isFile is a boolean, if true: creates a file, if false: creates a folder.
   * @param count is a countdown to limit the size of the test.
   */
  const recursiveFSTest = (shadowDir: string, isFile: boolean, count: number) => {
    if (count > 0) {
      const name = 'test' + count;
      const fromShadowDir = path.join(shadowDir, name);
      const fromRootDir = path.join(shadowTest.getShadowFolder(), fromShadowDir);

      if (isFile) {
        //add a new file
        it('should be able to add a new file: ' + name, function() {
          shadowTest.update(FileEventType.FILE_CREATED, fromShadowDir, '');
          assert.equal(fs.lstatSync(fromRootDir).isDirectory(), false);
        });

        //modify this new file
        it('should be able to modify a new file', function() {
          assert.equal(fs.readFileSync(fromRootDir).toString(), '');
          shadowTest.update(FileEventType.FILE_MODIFIED, fromShadowDir, 'test hej_' + count);
          assert.equal(fs.lstatSync(fromRootDir).isDirectory(), false);
          assert.equal(fs.readFileSync(fromRootDir).toString(), 'test hej_' + count);
        });

        //add more files in the same folder as this new file
        recursiveFSTest(shadowDir, count < 5, --count);

        //delete this new file
        it('should be able to delete a file', function() {
          shadowTest.update(FileEventType.FILE_DELETED, fromShadowDir);
          assert.equal(fs.existsSync(fromRootDir), false);
        });
      } else {
        //add a new folder
        it('should be able to add a new folder: ' + name, function() {
          shadowTest.update(FileEventType.DIR_CREATED, fromShadowDir);
          assert.equal(fs.lstatSync(fromRootDir).isDirectory(), true);
        });

        //populate this new folder with more data
        recursiveFSTest(fromShadowDir, count < 5, --count);
        recursiveFSTest(fromShadowDir, true, --count);

        //delete this folder
        it('should be able to delete a folder', function() {
          shadowTest.update(FileEventType.DIR_DELETED, fromShadowDir);
          assert.equal(fs.existsSync(fromRootDir), false);
        });
      }
    }
  };

  recursiveFSTest('', false, 8);

  /*
  it('should be able to delete the .shadow folder', function() {
    console.log('shadow folder: ' + shadowTest.getShadowFolder());
    shadowTest.update(FileEventType.DIR_DELETED, shadowTest.getShadowFolder());
    assert.equal(fs.existsSync(shadowTest.getShadowFolder()), false);
  }); */
});
