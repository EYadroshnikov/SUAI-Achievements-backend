import { NodeEnv } from './enums/node-env.enum';

export type AppConfig = {
  nodeEnv: NodeEnv;
  port: number;
  jwtSecret: string;
  accessTokenExpiration: number;
  refreshTokenExpiration: number;
};
