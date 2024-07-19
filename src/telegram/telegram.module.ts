import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { BullModule } from '@nestjs/bull';
import { TelegramNotificationProcessor } from './telegram-notification.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'telegram-notification-queue',
      limiter: {
        max: 1,
        duration: 2000,
      },
    }),
  ],
  providers: [TelegramService, TelegramNotificationProcessor],
  exports: [TelegramService],
})
export class TelegramModule {}
