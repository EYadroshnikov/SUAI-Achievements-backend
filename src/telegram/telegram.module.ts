import { forwardRef, Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { BullModule } from '@nestjs/bull';
import { TelegramNotificationProcessor } from './telegram-notification.processor';
import { UsersModule } from '../users/users.module';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegramMessageEntity } from './entities/telegram-message.entity';
import { TelegramUpdate } from './telegram.update';

@Module({
  imports: [
    TypeOrmModule.forFeature([TelegramMessageEntity]),
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
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        token: configService.get<string>('tg.botSecret'),
      }),
    }),
    forwardRef(() => UsersModule),
  ],
  providers: [TelegramService, TelegramNotificationProcessor, TelegramUpdate],
  exports: [TelegramService],
})
export class TelegramModule {}
