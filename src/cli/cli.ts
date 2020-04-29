import { program } from 'commander';
import Action from '@src/cli/ServerControl';

export default class CLI {
  constructor() {
    //Defining the options for the program's CLI client using Commander's API.
    program.version('0.0.1').description('Lumi CLI');

    // Echo command.
    program
      .command('echo <test>')
      .description('This echos the response')
      .alias('e')
      .action(async (_, cmdObj) => {
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
        const version = await Action.preform(cmdObj);
        console.log(version);
        process.exit();
      });

    // Health check command.
    program
      .command('healthcheck')
      .description('Returns ❤️ if the client server is alive')
      .alias('hc')
      .action(async cmdObj => {
        const heart = await Action.preform(cmdObj);
        console.log(heart);
        process.exit();
      });

    // Create room command.
    program
      .command('create <path>')
      .description('Creates a new room on the server')
      .alias('c')
      .action(async (_, cmdObj) => {
        const roomID = await Action.preform(cmdObj);
        console.log(`A new room has been created: ${roomID}`);
        process.exit();
      });

    // Join a room command.
    program
      .command('join <path> <roomID>')
      .description('Joins a room with a specific ID')
      .alias('j')
      .action(async (_1, _2, cmdObj: any) => {
        const couldJoin = await Action.preform(cmdObj);
        console.log(couldJoin ? 'You have joined the room' : 'Could not join the room');
        process.exit();
      });

    // Leave a room command.
    program
      .command('leave')
      .description('Leaves a room')
      .alias('l')
      .action(async (cmdObj: any) => {
        const answer = await Action.preform(cmdObj);
        console.log(answer);
        process.exit();
      });

    // End the process by parsing the input.
    program.parse(process.argv);
  }
}
