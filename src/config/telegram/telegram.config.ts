import { IsString } from 'class-validator';
import { registerAs } from '@nestjs/config';
import * as process from 'process';
import { TelegramConfig } from './telegram-config.type';
import validateConfig from '../../common/utils/validate-config';

class EnvironmentVariablesValidator {
  @IsString()
  TG_BOT_SECRET: string;
}

export default registerAs<TelegramConfig>('tg', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    botSecret: process.env.TG_BOT_SECRET,
  };
});
