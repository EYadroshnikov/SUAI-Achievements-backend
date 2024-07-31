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

  @IsNumber()
  ACCESS_TOKEN_EXPIRATION: number;

  @IsNumber()
  REFRESH_TOKEN_EXPIRATION: number;
}

export default registerAs<AppConfig>('app', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    nodeEnv: process.env.NODE_ENV as NodeEnv,
    port: +process.env.PORT,
    jwtSecret: process.env.JWT_SECRET,
    accessTokenExpiration: +process.env.ACCESS_TOKEN_EXPIRATION,
    refreshTokenExpiration: +process.env.REFRESH_TOKEN_EXPIRATION,
  };
});
