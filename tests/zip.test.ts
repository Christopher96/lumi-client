import Zip from '../src/common/zip';

describe('We shall be able to zip and unzip directories', () => {
  const zipper = new Zip();

  it('shall zip directories that retain its structure', () => {
    zipper.pack('test-repo', 'archive.zip');
  });

  it('shall unzip archive to specified folder', () => {
    zipper.unpack('archive.zip', './archive/');
  });
});
