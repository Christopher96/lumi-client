import { InteractiveCLI } from './interactive';
import { program } from 'commander';

export class CLI {
  constructor(/*private server: SocketIOClient.Socket*/) {
    /*
[create]: '-c' '--create' (+) <ID>
    Creates a new Lumi room, with either the provided ID or a randomly selected ID.
    Initiates uploading function of relevant folders.
    Returns room ID and other (Possible) relevant room information.
*/
    function create() {
      //Set the ID to a randomized value.
      //Randomized value is based on a set of parameters.
      //var id = CreateID();
      const id = 'LUMI1234';

      //Call room create function.
      //Room_Create(ID);

      //Placeholder: Echo the ID.
      console.log('LUMI: Creating room with ID: ' + id);
    }

    /*
[end]: '-e' '--end' + <ID>
    Closes the current session ID, if there is one.
    Forces connected clients to disconnect.
    If session does not exist, return error.
*/
    function end(id: string) {
      //If no room ID was specified, or if the room ID was not found,
      //Return error.
      if (id == undefined /*|| notFound()*/) throw console.error('LUMI: You are not hosting a room with the ID:' + id);

      //Call function that closes the room.
      //Room_Close(ID);

      //Placeholder: Echo the ID.
      console.log('LUMI: Closing room with ID: ' + id);
    }

    /*
[join]: '-j' '--join' + <ID>
    Joins a session of current ID.
    If there is no session with the specified ID, return error.
*/
    function join(id: string) {
      //Attempts connection to room ID.
      //Client_Connect(ID);

      //Placeholder: Echo the ID.
      console.log('LUMI: Joining room with ID: ' + id);
    }

    /*
[leave]: '-l' '--leave'
    Exits the current session.
*/
    function leave() {
      //Calls function that makes client disconnect from the room.
      //Client_Disconnect();

      //Placeholder: Leave message.
      console.log('LUMI: You have now left the room.');
    }

    /*
[getID]: '-id'
    Returns the current session ID.
*/
    function getID() {
      //Returns the current session ID.
      //return client_SessionID();
      return 'LUMI1234';
    }

    /*
[log]: '--log'
    Returns a log of timestaped updates.
*/
    function log() {
      //Fetch and print the log.
    }

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

    /*

_______Command List:_______

Specification: 
    [Name] 'shortcommand' 'longcommand' <Argument>
    + = Adding argument.
    (+) = Argument optional.

[create]: '-c' '--create' (+) <ID>
    Creates a new Lumi room, with either the provided ID or a randomly selected ID.
    Initiates uploading function of relevant folders.
    Returns room ID and other (Possible) relevant room information.

[end]: '-e' '--end' + <ID>
    Closes the current session ID, if there is one.
    Forces connected clients to disconnect.
    If session does not exist, return error.

[join]: '-j' '--join' + <ID>
    Joins a session of current ID.
    If there is no session with the specified ID, return error.

[leave]: '-l' '--leave'
    Exits the current session.

[getID]: '-id'
    Returns the current session ID.

[help]: '-h' '--help'
    Prints a guide explaining the commands.

[log]: '--log'
    Returns a log of timestaped updates.

*/

    // --interactive
    //new InteractiveCLI(server);
  }
}
