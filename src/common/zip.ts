import extract from 'extract-zip';
import fs from 'fs-extra';
import archiver from 'archiver';

export const zipUnpack = (filename: string): void => {
  const source = 'test.zip';
  const target = process.cwd() + '/test-repo';
  extract(source, { dir: target });
  console.log('unzipped');
};

export const zipPack = (filename: string): Promise<void> => {
  const archive = archiver('zip', { zlib: { level: 9 } });
  const stream = fs.createWriteStream('test-repo.zip');

  return new Promise((resolve, reject) => {
    archive
      .directory(filename, false)
      .on('error', err => reject(err))
      .pipe(stream);

    stream.on('close', () => resolve());
    archive.finalize();
  });
};
