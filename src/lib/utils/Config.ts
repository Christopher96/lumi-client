import fse from 'fs-extra';
import * as path from 'path';

/**
 * This is an object that represents the configuration stored on disk.
 * Feel free to add more fields when necessary.
 */
export interface IConfig {
  avatar?: Buffer,
  username: string,
  notifyFileChange: boolean,
  notifyFileError: boolean,
  notifyUserJoin: boolean,
  notifyUserLeave: boolean,
  theme: string
}

/**
 * A class to get the configuration that is stored on the local computer.
 */
export class Config {
  private static CONFIG_PATH = path.join(__dirname, '..', '..', '..', 'config.json');

  /**
   * Set a new custom path to the config.json file.
   * @param path the new path.
   */
  public static setPath(path: string) {
    this.CONFIG_PATH = path;
  }

  /**
   * Returns the configuration as an IConfig object.
   */
  public static async get(): Promise<IConfig> {
    return JSON.parse((await fse.readFile(this.CONFIG_PATH)).toString());
  }

  /**
   * Updates the configuration.
   * @param config the new updated configuration.
   */
  public static update(config: IConfig): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      fse.writeFile(this.CONFIG_PATH, JSON.stringify(config), { flag: 'w' }, err => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}
