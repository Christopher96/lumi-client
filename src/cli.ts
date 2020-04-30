import { program } from 'commander';
import { echoCommand } from './commands/echo';
import { pingCommand } from './commands/ping';
import { createRoomCommand } from './commands/createRoom';
import { joinRoomCommand } from './commands/joinRoom';
import { checkRoomCommand } from './commands/checkRoom';
import { listRoomsCommand } from './commands/listRoom';
import { startCommand } from './commands/start';

export default class CLI {
  constructor() {
    //Defining the commands for the program's CLI client using Commander's API.
    program
      .command('echo <thingToEcho>')
      .description('Echoes two strings provided by the user. For testing purposes.')
      .alias('e')
      .action((thingToEcho: any) => {
        return echoCommand(thingToEcho);
      });

    program
      .command('ping')
      .description('Will try to ping the server.')
      .alias('p')
      .action(() => {
        return pingCommand();
      });

    program
      .command('create <path>')
      .description('Creates a new room using a specific path.')
      .alias('c')
      .action(path => {
        return createRoomCommand(path);
      });

    program
      .command('start <path>')
      .description('Creates a new room using a specific path and joins the newly created room.')
      .alias('s')
      .action(path => {
        return startCommand(path);
      });

    program
      .command('join <roomId>')
      .description('Joins a specific room.')
      .alias('j')
      .action((roomId: any) => {
        return joinRoomCommand(roomId);
      });

    program
      .command('check <roomId>')
      .description('Check out a specific room.')
      .alias('c')
      .action((roomId: any) => {
        return checkRoomCommand(roomId);
      });

    program
      .command('list')
      .description('Will list all rooms.')
      .alias('l')
      .action((roomId: any) => {
        return listRoomsCommand(roomId);
      });

    program.parse(process.argv);
  }
}
