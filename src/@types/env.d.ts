declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: 'prod' | 'local';
    SOCKET_HOST: string;
    SOCKET_PORT: number;
    SOCKET_URL: string;
  }
}
