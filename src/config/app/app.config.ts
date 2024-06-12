import { IsEnum, IsNumber, IsString } from 'class-validator';
import { registerAs } from '@nestjs/config';
import * as process from 'node:process';
import { AppConfig } from './app-config.type';
import validateConfig from '../../common/utils/validate-config';
import { NodeEnv } from './enums/node-env.enum';

class EnvironmentVariablesValidator {
  @IsEnum(NodeEnv)
  NODE_ENV: NodeEnv;

  @IsNumber()
  PORT: number;

  @IsString()
  JWT_SECRET: string;
}

export default registerAs<AppConfig>('app', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    nodeEnv: process.env.NODE_ENV as NodeEnv,
    port: +process.env.PORT,
    jwtSecret: process.env.JWT_SECRET,
  };
});
