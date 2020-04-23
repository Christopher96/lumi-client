import Zip from '../src/common/zip';
import { assert } from 'chai';
import fs from 'fs-extra';

describe('We shall be able to zip and unzip directories', () => {
  const zipper = new Zip();

  const repo = 'test-repo';
  const file1 = 'test';
  const file2 = 'hello/hello.txt';

  const zipfile = 'archive.zip';
  const zipdest = 'archive';

  it('shall exist a "test-repo" folder with a predetermined structure', () => {
    assert.equal(fs.existsSync(repo + '/' + file1), true);
    assert.equal(fs.existsSync(repo + '/' + file2), true);
  });

  it('shall zip directories to specified folder', () => {
    zipper.pack(repo, zipfile);
    assert.equal(fs.existsSync(zipfile), true);
  });

  it('shall unzip archive to specified folder', () => {
    zipper.unpack(zipfile, zipdest);
    assert.equal(fs.existsSync(zipdest), true);
  });

  it('shall exist an "archive" folder with the same structure as "test-repo"', () => {
    assert.equal(fs.existsSync(zipdest + '/' + file1), true);
    assert.equal(fs.existsSync(zipdest + '/' + file2), true);
  });

  it('shall unzip directories to memory', () => {
    let memory = zipper.unpackBuff(zipfile);
    while (memory != null) {
      assert.exists(memory);
      zipper.pack(memory, zipfile);
      memory = zipper.unpackBuff(zipfile);
    }
  });

  it('shall zip directories to memory', () => {
    const memory = zipper.packBuff(repo);
    assert.exists(memory);
    zipper.unpack(memory, zipdest);
  });
});
