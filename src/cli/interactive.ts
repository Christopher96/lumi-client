import inquirer from 'inquirer';
import events from '@common/events';
import { IRoom } from '@common/interfaces';
import Socket from '@src/socket';

export class InteractiveCLI {
  constructor() {
    this.menu();
  }

  // Gives the user the option to select a room from a list
  selectRoom(rooms: IRoom[]): void {
    const options = rooms.map(room => `[${room.id}]: ${room.sourceFolderPath}`);

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
        Socket.get().emit(events.JOIN_ROOM, rooms[option]);
      });
  }

  // Creates a menu with different options
  menu(): void {
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
            Socket.get().emit(events.CREATE_ROOM, source);
            break;
          case 1:
            // Ask for a list of rooms
            Socket.get().emit(events.LIST_ROOMS);
            // When we get the rooms back
            Socket.get().on(events.LIST_ROOMS, (rooms: IRoom[]) => {
              // Send them to next dialog handler
              this.selectRoom(rooms);
            });
            break;
        }
      });
  }
}
