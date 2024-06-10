import { IsNumber, IsString } from 'class-validator';
import validateConfig from '../../utils/validate-config';
import { registerAs } from '@nestjs/config';
import * as process from 'node:process';
import { AppConfig } from './app-config.type';

class EnvironmentVariablesValidator {
  @IsNumber()
  PORT: number;

  @IsString()
  JWT_SECRET: string;
}

export default registerAs<AppConfig>('app', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    port: +process.env.PORT,
    jwtSecret: process.env.JWT_SECRET,
  };
});
