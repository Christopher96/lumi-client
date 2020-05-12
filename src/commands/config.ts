import { Console } from '../lib/utils/Console';
import { Config, IConfig } from '../lib/utils/Config';
import fse from 'fs-extra';
import path from 'path';

const validExtensions: string[] = ['.png', '.jpg'];

/**
 * Check if the picture exists and has a valid extension.
 * @param picturePath 
 */
function isValidAvatar(picturePath: string): boolean {
  if (!fse.pathExistsSync(picturePath)) {
    Console.error(`Could not find picture: ${picturePath}`);
    return false;
  }
  if (!validExtensions.find(ext => ext === path.extname(picturePath.toLowerCase()))) {
    Console.error(`Illegal picture extension: ${path.extname(picturePath)}`);
    return false;
  }

  return true;
}

export const configCommand = async obj => {
  if (obj.set) {
    const config: IConfig = await Config.get();
    const value = obj.args.join(' ');

    switch (obj.set) {
      case 'username':
        config.public.base.username = value;
        break;
      case 'avatar':
        {
          // If the user wants to remove the avatar it can be done with 'none'.
          if (value === 'none') {
            config.public.extended.avatar = null;
          } else {
            const picturePath = path.join(process.cwd(), value);
            if (isValidAvatar(picturePath)) config.public.extended.avatar = fse.readFileSync(picturePath);
          }
        }
        break;
      default:
        Console.error(`You cannot set ${obj.set}`);
        return;
    }

    Config.update(config);
  } else {
    Config.get().then(conf => console.log(conf));
  }
};
