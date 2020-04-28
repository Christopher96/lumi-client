import { program } from 'commander';
import Action from '@src/cli/ServerControl';

export default class CLI {
  constructor() {
    //Defining the options for the program's CLI client using Commander's API.
    program.version('0.0.1').description('Lumi CLI');

    // Echo command.
    program
      .command('echo <test>')
      .description('Will echo back the string')
      .action(async cmdObj => {
        const i = await Action.preform(cmdObj);
        console.log(i);
        process.exit();
      });

    // Version command.
    program
      .command('version')
      .description('Get the current version')
      .alias('v')
      .option('-a, --api', 'API version')
      .option('-c, --cli', 'CLI version')
      .action(async cmdObj => {
        const i = await Action.preform(cmdObj);
        console.log(i);
        process.exit();
      });

    // Create room command.
    program
      .command('create')
      .description('Creates a new room on the server')
      .alias('c')
      .action(async cmdObj => {
        const i = await Action.preform(cmdObj);
        console.log(i);
        process.exit();
      });

    // Join a room command.
    program
      .command('join <roomID>')
      .description('Joins a room with a specific ID')
      .alias('j')
      .action(async (cmdObj: any) => {
        const i = await Action.preform(cmdObj);
        console.log(i);
        process.exit();
      });

    // End the process by parsing the input.
    program.parse(process.argv);
  }
}
