import { forwardRef, Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { BullModule } from '@nestjs/bull';
import { TelegramNotificationProcessor } from './telegram-notification.processor';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'telegram-notification-queue',
      limiter: {
        max: 5,
        duration: 1000,
      },
      defaultJobOptions: {
        removeOnComplete: true,
      },
    }),
    forwardRef(() => UsersModule),
  ],
  providers: [TelegramService, TelegramNotificationProcessor],
  exports: [TelegramService],
})
export class TelegramModule {}
