import { OnQueueError, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { TelegramProcess } from './enums/telegram.process.enum';

@Processor('telegram-notification-queue')
export class TelegramNotificationProcessor {
  constructor(
    private configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}
  private readonly logger = new Logger(TelegramNotificationProcessor.name);

  @Process(TelegramProcess.NOTIFICATION)
  async handleJob(job: Job) {
    const { tgUserId, text } = job.data;
    await this.notify(tgUserId, text);
  }

  private async notify(tgUserId: string, text: string) {
    const user = await this.usersService.find({
      where: { tgId: tgUserId },
      loadEagerRelations: false,
      relations: ['userSettings'],
    });
    if (
      user.userSettings &&
      !user.userSettings.receiveTgAchievementNotifications
    ) {
      return;
    }

    const url = `https://api.telegram.org/bot${this.configService.get('tg.botSecret', { infer: true })}/sendMessage`;

    const payload = {
      chat_id: tgUserId,
      text: text,
      // https://core.telegram.org/bots/api#html-style
      parse_mode: 'html', // html | markdown
    };
    try {
      const res = await axios.post(url, payload);
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
