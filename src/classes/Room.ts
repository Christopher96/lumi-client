import * as uuid from 'uuid';
import { pathExists } from 'fs-extra';
import path from 'path';
import { IRoom } from '../common/interfaces';

/**
 * The Room class is used on the server side to represent a space where users can work together on files.
 * @author: Marcus Alevärn
 * Edited by @author: Tobias Johannesson
 * Written: 2020-04-18
 * Edited: 2020-04-21
 */
export default class RoomClass implements IRoom {
  /**
   * Every room needs to be uniquely identified.
   * We use an ID (that we call id) to seperate rooms from each other.
   */
  public id: string;

  /**
   * A room can have several connected users.
   */
  //private users;

  /**
   * Path to roomfolder
   */
  public roomFolderPath: string;

  /**
   * Path to sourceFolder
   */
  public sourceFolderPath: string;

  /**
   * Creates a new room.
   */
  constructor(sourceFolderPath: string) {
    this.id = uuid.v1();
    //this.users = [];
    this.roomFolderPath = this.getRoomFolderPath();
    this.sourceFolderPath = sourceFolderPath;
  }

  /**
   * Returns the room's ID.
   */
  public getid(): string {
    return this.id;
  }

  /**
   * Connects a new user to the room.
   */
  public addUser(client: SocketIO.Socket): void {
    client.join(this.id);
  }

  /**
   * Removes an user from the room.
   */
  //public removeUser(user: User): void {
  //  const updated: User[] = this.users.filter(u => u !== user);
  //  this.users = updated;
  //}

  /**
   * Returns an user from a specified index.
   */
  //public getUser(index: number): User {
  //  if (index < 0 || index >= this.users.length) throw new Error(`${index} was out of range!`);

  //  return this.users[index];
  //}

  /**
   * Returns the number of users that are currently in the room.
   */
  //public getUserCount(): number {
  //  return this.users.length;
  //}

  /**
   * Uses id to Create folder for room
   */
  public getRoomFolderPath(): string {
    // gets unique folder for room
    return path.resolve(`rooms/ ${this.getid()}`);
  }

  /**
   * Returns the path to sourceFolder.
   */
  public getSourceFolderPath(): string {
    return this.sourceFolderPath;
  }

  /**
   * Unzips file and stores in rooms folder
   */
  public unZip(): void {}

  /**
   * Remove rooms folder
   */
  //public removeFolder(): void { }

  // HOW CAN WE DO UNIT TESTING?
  // If id is not unique what to do
  // Remove room object and folder
  // Remove user handling?
}
