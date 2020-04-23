declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: 'prod' | 'local';
    SOCKET_HOST: string;
    SOCKET_PORT: string;
    SOCKET_URL: string;
    BUILD_VERSION: string;
  }
}
