import { program } from 'commander';
import { echoCommand } from './commands/echo';
import { versionCommand } from './commands/version';
import { createCommand } from './commands/create';
import { logCommand } from './commands/log';
import { killServerCommand } from './commands/kill-server';
import { joinCommand } from './commands/join';

export class CLI {
  constructor() {
    //Defining the options for the program's CLI client using Commander's API.
    program
      .version('0.0.1')
      .description('This is a CLI for LUMI.')
      .option('-l', '--log', logCommand);

    //Defining the commands for the program's CLI client using Commander's API.
    program
      //Echo test command
      .command('echo <test>')
      .description('Echoes two strings provided by the user. For testing purposes.')
      .alias('ec')
      .option('-r, --recursive', 'Remove recursively')
      .action(function(_1, cmdObj) {
        return echoCommand(cmdObj);
      });

    //Defining the commands for the program's CLI client using Commander's API.
    program
      //Echo test command
      .command('version')
      .description('Echoes two strings provided by the user. For testing purposes.')
      .alias('ec')
      .option('-a, --api', 'Remove recursively')
      .option('-c, --cli', 'Remove recursively')
      .action(async function(cmdObj) {
        return versionCommand(cmdObj);
      });

    program
      //Create room, host session
      .command('create <path>')
      .description('Creates a new session and a room from a path to a repository.')
      .alias('c')
      .option('--test')
      .action((_, path) => {
        return createCommand(path);
      });

    program
      //End session
      .command('kill-server')
      .description('Kills the demon server')
      .alias('ks')
      .action(cmdObject => {
        return killServerCommand(cmdObject);
      });

    program
      //Joins a session
      .command('join')
      .description('Joins an active session.')
      .alias('j')
      .action((cmdObj: any) => {
        return joinCommand(cmdObj);
      });

    program.parse(process.argv);
  }
}
