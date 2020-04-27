import fetch from 'node-fetch';
import Route from '@api/routes/route';
import { spawn } from 'child_process';
export class Action {
  static async preform(cmd: any): Promise<string> {
    const maxAttempts = 10;
    const msBetweenTries = 2000;
    let attempts = 0;

    const checkServer = async (): Promise<boolean> => {
      const isUp = await Action.serverUp();

      if (maxAttempts <= attempts) {
        throw new Error('Is not able to start demon server');
      }

      if (!isUp) {
        console.log('Trying to start server attempt ', attempts);
        await Action.startServer();
        attempts++;

        return new Promise(res => {
          setTimeout(() => {
            if (checkServer()) {
              res();
            }
          }, msBetweenTries);
        });
      }

      return true;
    };

    await checkServer();

    const command = cmd.parent.args.join(' ');
    const url = Route.getUrlFromCommands(command);
    return fetch(`http://localhost:${process.env.CLIENT_SERVER_PORT}/${url}`).then(v => v.text());
  }

  static startServer(): void {
    console.log('Starting server');
    const cmd = 'node';
    spawn(cmd, ['dist', 'START_SERVER'], {
      detached: true
    });
  }

  static serverUp(): Promise<boolean> {
    return fetch(`http://localhost:${process.env.CLIENT_SERVER_PORT}/healthcheck`)
      .then(() => true)
      .catch(() => false);
  }
}

export default Action;
