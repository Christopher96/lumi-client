import fetch from 'node-fetch';
import chalk from 'chalk';
import { Console } from '../lib/utils/Console';
import { API } from '../api/API';

export const pingCommand = async () => {
  let pingAmount = 0;
  Console.title('Trying to contact server');

  const timer = setInterval(async () => {
    const res = await API.BasicRequest.ping();

    if (res.status !== 200) {
      Console.error('Pinging the server does not seem to work :/');
      return;
    } else {
      if (pingAmount % 2 == 0) Console.blue('Ping');
      if (pingAmount % 2 == 1) Console.yellow('Pong');
    }

    if (pingAmount++ > 10) {
      Console.success('Successfully pinged 10 times');
      clearInterval(timer);
    }
  }, 400);
};
