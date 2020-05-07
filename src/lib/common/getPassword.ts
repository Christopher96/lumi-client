export async function getPassword(): Promise<string> {
  var readline = require('readline');
  var sha256 = require('js-sha256');

  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.stdoutMuted = true;

  rl._writeToOutput = function _writeToOutput(stringToWrite) {
    if (rl.stdoutMuted) rl.output.write('*');
    else rl.output.write(stringToWrite);
  };

  var hash: string;
  const PUBLICKEY1 = 'U9kNjNW*wqtr%4Fr=jvak-!_4*UNBS7mKWLZT8_hGpfqZ2jJUxFpQub7^';
  const PUBLICKEY2 = 'A_62Z_D?PMeQYYN^dx--LEVUVdWS';
  return new Promise(res => {
    rl.question(null, function(password: string) {
      hash = sha256(PUBLICKEY1 + password.trim() + PUBLICKEY2);
      rl.close();
      res(hash);
    });
  });
}
