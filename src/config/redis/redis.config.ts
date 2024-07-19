import { IsNumber, IsString } from 'class-validator';
import { registerAs } from '@nestjs/config';
import * as process from 'process';
import { RedisConfig } from './redis-config.type';
import validateConfig from '../../common/utils/validate-config';

class EnvironmentVariablesValidator {
  @IsString()
  REDIS_HOST: string;

  @IsNumber()
  REDIS_PORT: number;
}

export default registerAs<RedisConfig>('redis', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
  };
});
