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
      .action((thingToEcho: string) => {
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
      .command('create')
      .description('Creates a new room.')
      .alias('c')
      .option('-d, --dir <path>', 'Use a custom directory.')
      .action(obj => {
        if (obj.dir) return createRoomCommand(obj.dir);
        else return createRoomCommand(process.cwd());
      });

    program
      .command('start')
      .description('Creates a new room and joins it.')
      .alias('s')
      .option('-d, --dir <path>', 'Use a custom directory.')
      .action(obj => {
        if (obj.dir) return startCommand(obj.dir);
        else return startCommand(process.cwd());
      });

    program
      .command('join <roomId>')
      .description('Joins a specific room.')
      .alias('j')
      .option('-d, --dir <path>', 'Use a custom directory.')
      .action((roomId: string, obj) => {
        if (obj.dir) return joinRoomCommand(roomId, obj.dir);
        else return joinRoomCommand(roomId, process.cwd());
      });

    program
      .command('check <roomId>')
      .description('Check out a specific room.')
      .alias('ch')
      .action((roomId: string) => {
        return checkRoomCommand(roomId);
      });

    program
      .command('list')
      .description('Will list all rooms.')
      .alias('l')
      .action((roomId: string) => {
        return listRoomsCommand(roomId);
      });

    program.parse(process.argv);
  }
}
