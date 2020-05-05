import fse from 'fs-extra';
import path from 'path';

export type IConfig = {
  username: string;
};

export class Config {
  public static async getConfig() {
    const jsonConfig = (await fse.readFile(path.join(__dirname, 'config.json'))).toJSON();
    console.log(jsonConfig);
  }
}


Config.getConfig();