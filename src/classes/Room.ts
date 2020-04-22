import * as uuid from 'uuid';
import User from './User';
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
   * We use an ID (that we call roomID) to seperate rooms from each other.
   */
  public roomID: string;

  /**
   * A room can have several connected users.
   */
  private users: User[];

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
    this.roomID = uuid.v1();
    this.users = [];
    this.roomFolderPath = this.getRoomFolderPath();
    this.sourceFolderPath = sourceFolderPath;
  }

  /**
   * Returns the room's ID.
   */
  public getRoomID(): string {
    return this.roomID;
  }

  /**
   * Adds an new user to the room.
   */
  public addUser(user: User): void {
    this.users.push(user);
  }

  /**
   * Removes an user from the room.
   */
  public removeUser(user: User): void {
    const updated: User[] = this.users.filter(u => u !== user);
    this.users = updated;
  }

  /**
   * Returns an user from a specified index.
   */
  public getUser(index: number): User {
    if (index < 0 || index >= this.users.length) throw new Error(`${index} was out of range!`);

    return this.users[index];
  }

  /**
   * Returns the number of users that are currently in the room.
   */
  public getUserCount(): number {
    return this.users.length;
  }

  /**
   * Uses roomID to Create folder for room
   */
  public getRoomFolderPath(): string {
    // gets unique folder for room
    return path.resolve(`rooms/ ${this.getRoomID()}`);
  }

  /**
   * Returns the path to sourceFolder.
   */
  public getSourceFolderPath(): string {
    return this.sourceFolderPath;
  }

  /**
   * Remove rooms folder
   */
  //public removeFolder(): void { }

  // HOW CAN WE DO UNIT TESTING?
  // If id is not unique what to do
  // Remove room object and folder
  // Remove user handling?
}
