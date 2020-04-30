declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: 'prod' | 'local';
    SERVER_ENDPOINT: string;
  }
}
