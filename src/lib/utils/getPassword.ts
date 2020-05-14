import inquirer from 'inquirer';
import { setPassword } from './setPassword';

export const getPassword = async (msg: string): Promise<string | null> => {
  return inquirer
    .prompt([
      {
        type: 'password',
        message: msg,
        name: 'input',
        mask: '*'
      }
    ])
    .then(answer => {
      if (answer.input.trim() === '') return null;
      else return setPassword(answer.input);
    });
};
