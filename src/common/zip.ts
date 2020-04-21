import extract from 'extract-zip';
import fs from 'fs-extra';
import archiver from 'archiver';

export class Zip {
  /**
   *
   * @param sourcefile - The name of the zip file to be unpacked.
   * @param dest - The destination folder where the contents will be unpacked. Requires an absolute path.
   */
  public zipUnpack = (sourcefile: string, dest: string): void => {
    extract(sourcefile, { dir: dest });
    console.log('unzipped');
  };

  /**
   *
   * @param sourcefile - The name of the file or folder to be zipped.
   * @param dest - The destination folder to write the zip archive. Requires relative path.
   */
  public zipPack = (sourcefile: string, dest: string): Promise<void> => {
    const archive = archiver('zip', { zlib: { level: 9 } });
    const stream = fs.createWriteStream(dest);

    return new Promise((resolve, reject) => {
      archive
        .directory(sourcefile, false)
        .on('error', err => reject(err))
        .pipe(stream);

      stream.on('close', () => resolve());
      archive.finalize();
    });
  };
}
