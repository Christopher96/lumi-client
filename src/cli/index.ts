import { InteractiveCLI } from './interactive';
import { program } from 'commander';
import e from 'express';

export class CLI {
  constructor() {
    /**
     * Command [Create]: '-c' '--create'
     * Creates a new room, assigning the creator as a host.
     */
    function create(path) {
      var id = 'LUMI1234';
      console.log('LUMI: Creating room with ID: ' + id + ' from folder at path: ' + path);
    }

    /**
     * Command [End]: '-e' '--end'
     * Closes the currently hosted session from provided ID.
     * Throws error if there is no session with the provided ID.
     *
     * @param id ID of room to close.
     */
    function end(id: string) {
      //If no room ID was specified, or if the room ID was not found, return error.
      if (id == undefined /*|| notFound()*/) throw console.error('LUMI: You are not hosting a room with the ID:' + id);

      console.log('LUMI: Closing room with ID: ' + id);
    }

    /**
     * Command [Join]: '-j' '--join'
     * Joins a session of the provided ID.
     * If there is no session with the provided ID, throw error.
     *
     * @param id ID of room to join.
     */
    function join(id: string) {
      console.log('LUMI: Joining room with ID: ' + id);
    }

    /**
     * Command [Leave]: '-l' '--leave'
     * Exits the current session.
     */
    function leave() {
      console.log('LUMI: You have now left the room.');
    }

    /**
     * Command [GetID]: '-i' '--id'
     * Returns the current session ID.
     */
    function getID() {
      return 'LUMI1234';
    }

    /**
     * Command [Log]: '-l' '--log'
     * If the user is connected to a room:
     * Fetches and prints a log of the most recent changes.
     */
    function log() {}

    //Defining the options for the program's CLI client using Commander's API.
    program
    .version('0.0.1')
    .description('This is a CLI for LUMI.')

    .option('-l', '--log', log);

    //Defining the commands for the program's CLI client using Commander's API.
    program
      //Echo test command
      .command('echo <text1> <text2>')
      .description('Echoes two strings provided by the user. For testing purposes.')
      .alias('ec')
      .action((text1, text2) => { console.log(text1 + text2); })
    
    program
    //Create room, host session
      .command('create <path>')
      .description('Creates a new session and a room from a path to a repository.')
      .alias('c')
      .action((path) => { create(path); })

    program
    //End session
      .command('end <id>')
      .description('Ends a session, disconnecting all connected clients.')
      .alias('e')
      .action((id) => { end(id); })

    program
    //Joins a session
      .command('join <id>')
      .description('Joins an active session.')
      .alias('j')
      .action((id) => { join(id); })

    program
    //Leave session
      .command('leave')
      .description('Leaves the session to which you are connected.')
      .alias('l')
      .action(() => { leave(); })

    program
    //Get current session ID.
      .command('getid')
      .description('Returns the ID of the current session.')
      .alias('id')
      .action(() => { getID(); })

    program.parse(process.argv); //End the process by parsing the input.*/
  }
}
