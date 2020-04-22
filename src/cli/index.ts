import { InteractiveCLI } from './interactive';
import { program } from 'commander';

export class CLI {
  constructor() {
    /**
     * Command [Create]: '-c' '--create'
     * Creates a new room, assigning the creator as a host.
     */
    function create() {
      const id = 'LUMI1234';
      console.log('LUMI: Creating room with ID: ' + id);
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

    //Defining the commands for the program's CLI client using Commander's API.
    program
      .version('0.0.1')
      .description('This is a test CLI for LUMI.')
      .option('-c, --create', 'Creates a room with a randomized ID.', create)
      .option('-e, --end <string>', 'Closes the room with the specified ID.', end)
      .option('-j, --join <string>', 'Connects a client to the room with the specified ID.', join)
      .option('-l, --leave', 'Disconnects the client from the room it is connected to.', leave)
      .option('-i --id', 'Returns the current room ID.', getID)
      .parse(process.argv); //End the process by parsing the input.
  }
}
