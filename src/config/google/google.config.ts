import { IsJSON } from 'class-validator';
import { registerAs } from '@nestjs/config';
import validateConfig from '../../common/utils/validate-config';
import * as process from 'process';
import { GoogleConfig } from './google-config.type';

class EnvironmentVariablesValidator {
  @IsJSON()
  GOOGLE_CREDENTIALS: string;
}

export default registerAs<GoogleConfig>('google', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
  };
});
