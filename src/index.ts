import dotenv from 'dotenv';
import inquirer from 'inquirer';
import io from 'socket.io-client';
import events from './common/events';
import { socketHandler } from './socket';
import { Room } from './common/interfaces';
dotenv.config();

const bootstrap = async (): Promise<void> => {
  // Configure PORT and HOST to the environment variables set in .env
  // or use localhost:8080 locally
  const host = process.env.HOST || 'localhost';
  const port = process.env.PORT || '8080';

  const serverUrl = `http://${host}:${port}`;

  // Create the server instance with the server
  const server: SocketIOClient.Socket = io(serverUrl, {
    transports: ['websocket']
  });

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
            const source = 'test-repo';
            server.emit(events.CREATE_ROOM, source);
            break;
          case 1:
            server.emit(events.LIST_ROOMS);
            server.on(events.LIST_ROOMS, (rooms: Room[]) => {
              selectRoom(rooms);
            });
            break;
        }
      });
  };

  // On connection to the server
  server.on(events.CLIENT_CONNECT, () => {
    console.log('connected');
    socketHandler(server);
    menu();
  });
};

bootstrap();
