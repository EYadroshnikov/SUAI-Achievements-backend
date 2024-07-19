import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Processor('telegram-notification-queue')
export class TelegramNotificationProcessor {
  constructor(private configService: ConfigService) {}
  private readonly logger = new Logger(TelegramNotificationProcessor.name);

  @Process()
  async handleJob(job: Job) {
    const { tgUserId, text } = job.data;
    await this.notify(tgUserId, text);
  }

  private async notify(tgUserId: number, text: string) {
    const url = `https://api.telegram.org/bot${this.configService.get('tg.botSecret', { infer: true })}/sendMessage`;

    const payload = {
      chat_id: tgUserId,
      text: text,
      // https://core.telegram.org/bots/api#html-style
      parse_mode: 'html', // html | markdown
    };
    try {
      const res = axios.post(url, payload);
    } catch (error) {
      this.logger.error(error);
      throw Error;
    }
  }
}
