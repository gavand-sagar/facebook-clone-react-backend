declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ACCESS_TOKEN_SECRET: string;
      ACCESS_TOKEN_EXPIRES_IN: string;
      PORT: string;
      FRONTEND_ORIGIN: string;
      DB_URI: string;
      DB_NAME: string;
      SKIP_VALIDATION: 'true' | 'false';
      SALT_WORK_FACTOR: string;
      WEBSOCKET_SERVER_URL: string;
      WEBSOCKET_SERVER_KEY: string;
    }
  }
}

export {};
