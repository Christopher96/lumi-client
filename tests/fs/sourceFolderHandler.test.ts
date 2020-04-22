import { assert } from 'chai';
import fs from 'fs-extra';
import path from 'path';
import { SourceFolderHandler } from '../../src/fs/sourceFolderHandler';
import { FileEventType } from '../../src/fs/fileEventType';

/**
 * The FileSystem functions are used for handling file operations such as creating, moving and removing files and folders.
 * @author Michael Arenander
 * @date 2020-04-22
 */

describe('We shall be able to identify and send source content updates', function() {
  const sfh = new SourceFolderHandler('test-repo');

  it('should be able to create a sourceFolderHandler file', function() {
    assert.exists(sfh);
  });
});
