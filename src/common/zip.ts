import zipper from 'zip-local';
import fs from 'fs-extra';

class Zip {
  /**
   * Synchronous method to extract a zip archive to a specified file or folder.
   * @param source - The name of the zip file to be unpacked.
   * @param dest - The destination folder where the contents will be unpacked. Requires an absolute path.
   */
  public unpack(source: string, dest: string): void {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest);
    }
    zipper.sync.unzip(source).save(dest);
  }

  /**
   * Synchronous method to create a zip archive from a specified file or folder.
   * @param source - The name of the file or folder to be zipped.
   * @param dest - The destination folder to write the zip archive. Requires relative path.
   */
  public pack(source: string, dest: string): void {
    zipper.sync
      .zip(source)
      .compress()
      .save(dest);
  }
}

export default Zip;
