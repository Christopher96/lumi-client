import dotenv from 'dotenv';
import inquirer from 'inquirer';
import io from 'socket.io-client';
import events from './common/events';
import { SocketHandler } from './socket';
import { Room } from './common/interfaces';
dotenv.config();

class Bootstrap {
  constructor() {
    // Configure PORT and HOST to the environment variables set in .env
    // or use localhost:8080 locally
    const host = process.env.HOST || 'localhost';
    const port = process.env.PORT || '8080';

    const serverUrl = `http://${host}:${port}`;

    // Create the server instance with the server
    const server: SocketIOClient.Socket = io(serverUrl, {
      transports: ['websocket']
    });

    // Gives the user the option to select a room from a list
    const selectRoom = (rooms: Room[]): void => {
      const options = rooms.map(room => `[${room.id}]: ${room.source}`);

      inquirer
        .prompt([
          {
            message: 'Which room do you want to join?',
            type: 'list',
            choices: options,
            name: 'option'
          }
        ])
        .then(answers => {
          const option = options.indexOf(answers.option);
          server.emit(events.JOIN_ROOM, rooms[option]);
        });
    };

    // Creates a menu with different options
    const menu = (): void => {
      const options = ['Create a room', 'Join a room'];

      inquirer
        .prompt([
          {
            message: 'What do you want to do?',
            type: 'list',
            choices: options,
            name: 'option'
          }
        ])
        .then(answers => {
          const option = options.indexOf(answers.option);

          switch (option) {
            case 0:
              // TODO Select the source folder interactively or through command
              const source = 'test-repo';
              // Create the room with the chosen source folder
              server.emit(events.CREATE_ROOM, source);
              break;
            case 1:
              // Ask for a list of rooms
              server.emit(events.LIST_ROOMS);
              // When we get the rooms back
              server.on(events.LIST_ROOMS, (rooms: Room[]) => {
                // Send them to next dialog handler
                selectRoom(rooms);
              });
              break;
          }
        });
    };

    // On connection to the server
    server.on(events.CLIENT_CONNECT, () => {
      console.log('connected');
      // Handle the connection to the server
      new SocketHandler(server);
      // Show the menu
      menu();
    });
  }
}

new Bootstrap();
