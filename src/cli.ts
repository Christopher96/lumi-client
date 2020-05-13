import { program } from 'commander';
import { echoCommand } from './commands/echo';
import { pingCommand } from './commands/ping';
import { createRoomCommand } from './commands/createRoom';
import { joinRoomCommand } from './commands/joinRoom';
import { checkRoomCommand } from './commands/checkRoom';
import { listRoomsCommand } from './commands/listRoom';
import { startCommand } from './commands/start';
import { listUsersInRoomCommand } from './commands/listUsersInRoom';
import { configCommand } from './commands/config';
import { logsCommand } from './commands/logs';

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
      .command('logs <id>')
      .description('Will show all the logs from a certain room or all')
      .alias('l')
      .option('-a, --amount <amount>')
      .option('-o, --offset <offset>')
      .option('-r, --reverse')
      .action((idOrAll, obj, te) => {
        return logsCommand(idOrAll, obj);
      });

    program
      .command('create')
      .description('Creates a new room.')
      .alias('c')
      .option('-d, --dir <path>', 'Use a custom directory.')
      .action(obj => {
        if (obj.dir) {
          console.log('Command received: ' + obj.dir);
          return createRoomCommand(obj.dir);
        } else return createRoomCommand(process.cwd());
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
      .command('rooms')
      .description('Will list all rooms.')
      .alias('r')
      .action(() => {
        return listRoomsCommand();
      });

    program
      .command('users <roomId>')
      .description('Will list all active users in the current room.')
      .alias('u')
      .action((roomId: string) => {
        return listUsersInRoomCommand(roomId);
      });

    program
      .command('config')
      .description('A command to read or update the config.')
      .alias('co')
      .option('-s, --set <key> <value>', 'Set a new value in the config')
      .action(obj => {
        return configCommand(obj);
      });

    program.parse(process.argv);
  }
}
