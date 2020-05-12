import { Console } from '../lib/utils/Console';
import { Config, IConfig } from '../lib/utils/Config';

export const configCommand = async obj => {
  if (obj.set) {
    const config: IConfig = await Config.get();
    const value = obj.args.join(' ');

    switch (obj.set) {
      case 'username':
        config.public.base.username = value;
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
