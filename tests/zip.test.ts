import Zip from '../src/common/zip';
import { assert } from 'chai';
import fs from 'fs-extra';

describe('We shall be able to zip and unzip directories', () => {
  const zipper = new Zip();

  it('shall exist a "test-repo" folder with a predetermined structure', () => {
    assert.equal(fs.existsSync('test-repo/test'), true);
    assert.equal(fs.existsSync('test-repo/hello/hello.txt'), true);
  });

  it('shall zip directories to specified folder', () => {
    zipper.pack('test-repo', 'archive.zip');
    assert.equal(fs.existsSync('archive.zip'), true);
  });

  it('shall unzip archive to specified folder', () => {
    zipper.unpack('archive.zip', './archive/');
    assert.equal(fs.existsSync('./archive'), true);
  });

  it('shall exist an "archive" folder with the same structure as "test-repo"', () => {
    assert.equal(fs.existsSync('archive/test'), true);
    assert.equal(fs.existsSync('archive/hello/hello.txt'), true);
  });
});
