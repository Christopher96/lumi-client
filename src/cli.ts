import { program } from 'commander';
import { echoCommand } from './commands/echo';
import { pingCommand } from './commands/ping';
import { createRoomCommand } from './commands/createRoom';
import { joinRoomCommand } from './commands/joinRoom';
import { checkRoomCommand } from './commands/checkRoom';
import { listRoomsCommand } from './commands/listRoom';
import { startCommand } from './commands/start';
import { allahCommand } from './commands/allah';

export default class CLI {
  constructor() {
    //Defining the commands for the program's CLI client using Commander's API.
    program
      //Echo test command
      .command('echo <thingToEcho>')
      .description('Echoes two strings provided by the user. For testing purposes.')
      .alias('ec')
      .action(function(thingToEcho) {
        return echoCommand(thingToEcho);
      });

    program
      //Echo test command
      .command('ping')
      .description('Echoes two strings provided by the user. For testing purposes.')
      .alias('ec')
      .action(function() {
        return pingCommand();
      });

    program
      //Echo test command
      .command('allah <bomb>')
      .description('Plants the bomb on the server')
      .alias('ak')
      .action(function(bomb) {
        return allahCommand(bomb);
      });

    // Version command.
    // program
    //   //Echo test command
    //   .command('version')
    //   .description('Echoes two strings provided by the user. For testing purposes.')
    //   .alias('ec')
    //   .option('-a, --api', 'Remove recursively')
    //   .option('-c, --cli', 'Remove recursively')
    //   .action(async function(cmdObj) {
    //     return versionCommand(cmdObj);
    //   });

    program
      //Create room, host session
      .command('create <path>')
      .description('Creates a new session and a room from a path to a repository.')
      .alias('c')
      .action(path => {
        return createRoomCommand(path);
      });

    program
      //Create room, host session
      .command('start <path>')
      .description('Creates a new session and a room from a path to a repository.')
      .alias('c')
      .action(path => {
        return startCommand(path);
      });

    // Join a room command.
    program
      //Joins a session
      .command('join <roomId>')
      .description('Joins an active session.')
      .alias('j')
      .action((roomId: any) => {
        return joinRoomCommand(roomId);
      });

    // Join a room command.
    program
      //Joins a session
      .command('check <roomId>')
      .description('Joins an active session.')
      .alias('j')
      .action((roomId: any) => {
        return checkRoomCommand(roomId);
      });

    // Join a room command.
    program
      //Joins a session
      .command('list')
      .description('Joins an active session.')
      .alias('j')
      .action((roomId: any) => {
        return listRoomsCommand(roomId);
      });

    program.parse(process.argv);
  }
}
