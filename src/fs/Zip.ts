import fs from 'fs-extra';
import zipper from 'zip-local';

export default class Zip {
  public static zip(path: string): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      zipper.zip(path, (error, zipped) => {
        if (error) {
          reject(error);
        } else {
          resolve(zipped.compress().memory());
        }
      });
    });
  }

  public static unzip(savePath: string, buffer: Buffer): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      zipper.unzip(buffer, (err, unzipped) => {
        if (err) {
          reject(err);
        } else {
          fs.ensureDir(savePath)
            .then(() => {
              unzipped.save(savePath, err => {
                if (err) {
                  reject(err);
                } else {
                  resolve();
                }
              });
            })
            .catch(err => reject(err));
        }
      });
    });
  }
}
