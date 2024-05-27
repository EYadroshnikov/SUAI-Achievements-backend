import { IsNumber, IsString } from 'class-validator';
import { registerAs } from '@nestjs/config';
import * as process from 'process';
import validateConfig from '../../utils/validate-config';
import { PostgresConfig } from './postgres-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  POSTGRES_HOST: string;

  @IsNumber()
  POSTGRES_PORT: number;

  @IsString()
  POSTGRES_USERNAME: string;

  @IsString()
  POSTGRES_PASSWORD: string;

  @IsString()
  POSTGRES_DB: string;
}

export default registerAs<PostgresConfig>('postgres', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  };
});
