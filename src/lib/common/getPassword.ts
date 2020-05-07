import { sha256 } from 'js-sha256';

// This method is written in a combination of TypeScript and
// pure JavaScript. The readline interface when imported with
// TypeScript does not have the same functionality as the
// same interface in JavaScript, which is needed for the output
// to be displayed as asterisks (*) instead of pure text.
export async function getPassword(): Promise<string> {
  var readline = require('readline');
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.stdoutMuted = true;

  rl._writeToOutput = function _writeToOutput(stringToWrite) {
    if (rl.stdoutMuted) rl.output.write('*');
    else rl.output.write(stringToWrite);
  };

  let hash: string;
  const PUBLICKEY1 = 'U9kNjNW*wqtr%4Fr=jvak-!_4*UNBS7mKWLZT8_hGpfqZ2jJUxFpQub7^';
  const PUBLICKEY2 = 'A_62Z_D?PMeQYYN^dx--LEVUVdWS';
  return new Promise(res => {
    rl.question(null, function(password: string) {
      rl.close();
      console.log('\n');
      if (password.trim() === '') {
        res(null);
      } else {
        hash = sha256(PUBLICKEY1 + password.trim() + PUBLICKEY2);
        res(hash);
      }
    });
  });
}
