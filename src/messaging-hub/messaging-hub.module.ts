import { Module } from '@nestjs/common';
import { MessagingHubService } from './messaging-hub.service';
import { MessagingHubController } from './messaging-hub.controller';
import { UsersModule } from '../users/users.module';
import { TelegramModule } from '../telegram/telegram.module';
import { VkModule } from '../vk/vk.module';

@Module({
  imports: [UsersModule, TelegramModule, VkModule],
  controllers: [MessagingHubController],
  providers: [MessagingHubService],
})
export class MessagingHubModule {}
