import { sha256 } from 'js-sha256';
import inquirer from 'inquirer';

export async function getPassword(msg?: string): Promise<string> {
  const hash = async (input: string): Promise<string> => {
    return new Promise(res => {
      const PUBLICKEY1 = 'U9kNjNW*wqtr%4Fr=jvak-!_4*UNBS7mKWLZT8_hGpfqZ2jJUxFpQub7^';
      const PUBLICKEY2 = 'A_62Z_D?PMeQYYN^dx--LEVUVdWS';
      const hash = sha256(PUBLICKEY1 + input.trim() + PUBLICKEY2);
      res(hash);
    });
  };

  if (msg) return hash(msg);

  inquirer
    .prompt([
      {
        type: 'password',
        message: msg ? msg : 'Enter a password:',
        name: 'input',
        mask: '*'
      }
    ])
    .then(answer => {
      if (answer.input.trim() === '') return null;
      else return hash(answer.input);
    });
}
