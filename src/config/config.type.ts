import { PostgresConfig } from './postres/postgres-config.type';
import { AppConfig } from './app/app-config.type';
import { RedisConfig } from './redis/redis-config.type';
import { VkConfig } from './vk/vk-config.type';
import { TelegramConfig } from './telegram/telegram-config.type';

export type AllConfigType = {
  app: AppConfig;
  postgres: PostgresConfig;
  redis: RedisConfig;
  vk: VkConfig;
  telegram: TelegramConfig;
};
