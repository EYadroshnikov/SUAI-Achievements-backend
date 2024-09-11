import { IsString } from 'class-validator';
import { registerAs } from '@nestjs/config';
import * as process from 'process';
import { VkConfig } from './vk-config.type';
import validateConfig from '../../common/utils/validate-config';

class EnvironmentVariablesValidator {
  @IsString()
  VK_MINI_APP_SECRET: string;

  @IsString()
  VK_MINI_APP_SERVICE_KEY: string;

  @IsString()
  VK_COMMUNITY_API_KEY: string;
}

export default registerAs<VkConfig>('vk', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    miniAppSecret: process.env.VK_MINI_APP_SECRET,
    miniAppServiceKey: process.env.VK_MINI_APP_SERVICE_KEY,
    communityApiKey: process.env.VK_COMMUNITY_API_KEY,
  };
});
