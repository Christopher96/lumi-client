import { sha256 } from 'js-sha256';

export const setPassword = async (input: string): Promise<string> => {
  return new Promise(res => {
    const PUBLICKEY1 = 'U9kNjNW*wqtr%4Fr=jvak-!_4*UNBS7mKWLZT8_hGpfqZ2jJUxFpQub7^';
    const PUBLICKEY2 = 'A_62Z_D?PMeQYYN^dx--LEVUVdWS';
    const hash = sha256(PUBLICKEY1 + input.trim() + PUBLICKEY2);
    res(hash);
  });
};
