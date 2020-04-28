import Action from '../utils/action';

export const killServerCommand = async (cmdObj: any) => {
  const i = await Action.preform(cmdObj);
  console.log(i);
  process.exit();
};
