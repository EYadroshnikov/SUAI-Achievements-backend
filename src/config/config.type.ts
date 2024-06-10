import { PostgresConfig } from './postres/postgres-config.type';
import { AppConfig } from './app/app-config.type';

export type AllConfigType = {
  postgres: PostgresConfig;
  app: AppConfig;
};
