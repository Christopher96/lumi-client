import { sha256 } from 'js-sha256';
let readline = require('readline');

export async function getPassword(arg?: string): Promise<string> {
  if (arg) {
    return new Promise(res => {
      const PUBLICKEY1 = 'U9kNjNW*wqtr%4Fr=jvak-!_4*UNBS7mKWLZT8_hGpfqZ2jJUxFpQub7^';
      const PUBLICKEY2 = 'A_62Z_D?PMeQYYN^dx--LEVUVdWS';
      const hash = sha256(PUBLICKEY1 + arg.trim() + PUBLICKEY2);
      res(hash);
    });
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.stdoutMuted = true;
  rl._writeToOutput = function _writeToOutput(stringToWrite) {
    if (rl.stdoutMuted) rl.output.write('*');
    else rl.output.write(stringToWrite);
  };

  return new Promise(res => {
    rl.question(null, function(password: string) {
      rl.close();
      console.log('\n');
      if (password.trim() === '') {
        res(null);
      } else {
        const PUBLICKEY1 = 'U9kNjNW*wqtr%4Fr=jvak-!_4*UNBS7mKWLZT8_hGpfqZ2jJUxFpQub7^';
        const PUBLICKEY2 = 'A_62Z_D?PMeQYYN^dx--LEVUVdWS';
        const hash = sha256(PUBLICKEY1 + password.trim() + PUBLICKEY2);
        res(hash);
      }
    });
  });
}
