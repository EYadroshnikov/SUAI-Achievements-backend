import { OnQueueError, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { TelegramProcess } from './enums/telegram.process.enum';
import { TelegramService } from './telegram.service';

@Processor('telegram-notification-queue')
export class TelegramNotificationProcessor {
  constructor(
    private configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly telegramService: TelegramService,
  ) {}
  private readonly logger = new Logger(TelegramNotificationProcessor.name);

  @Process(TelegramProcess.NOTIFICATION)
  async handleJob(job: Job) {
    const { tgUserId, text } = job.data;
    await this.notify(tgUserId, text);
  }

  private async notify(tgUserId: string, text: string) {
    // const user = await this.usersService.findOne({
    //   where: { tgId: tgUserId },
    //   loadEagerRelations: false,
    //   relations: ['userSettings'],
    // });
    // if (
    //   user.userSettings &&
    //   !user.userSettings.receiveTgAchievementNotifications
    // ) {
    //   return;
    // }

    try {
      await this.telegramService.sendNotification(tgUserId, text);
    } catch (error) {
      this.logger.error(error);
      throw Error;
    }
  }

  @OnQueueFailed()
  async onQueueFailed(job: Job, error: any) {
    this.logger.error(`Task ${job.id} failed: ${error.message}`, error.stack);
  }

  @OnQueueError()
  async onQueueError(error: any) {
    this.logger.error(error);
  }
}
