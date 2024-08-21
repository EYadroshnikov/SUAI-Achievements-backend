import { Injectable } from '@nestjs/common';
import * as crypto from 'node:crypto';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { TelegramProcess } from './enums/telegram.process.enum';

@Injectable()
export class TelegramService {
  constructor(
    private configService: ConfigService,
    @InjectQueue('telegram-notification-queue')
    private telegramNotificationQueue: Queue,
  ) {}

  async verifyInitData(initData: string) {
    const params = new URLSearchParams(initData);
    const vals: { [key: string]: string } = {};

    params.forEach((value, key) => {
      vals[key] = decodeURIComponent(value);
    });

    // if (Math.floor(Date.now() / 1000) - +vals['auth_date'] > 5 * 60) {
    //   return { isSignValid: false };
    // }

    // Create data check string excluding 'hash'
    const dataCheckArray = Object.entries(vals)
      .filter(([key]) => key !== 'hash')
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`);
    const dataCheckString = dataCheckArray.join('\n');

    // Calculate HMAC
    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(this.configService.get('tg.botSecret'))
      .digest();
    const hmac = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    const isSignValid = hmac === vals['hash'];
    const tgId = JSON.parse(vals['user']).id;
    return { isSignValid, tgId };
  }

  async addToTelegramNotificationQueue(tgUserId: string, text: string) {
    return this.telegramNotificationQueue.add(TelegramProcess.NOTIFICATION, {
      tgUserId,
      text,
    });
  }
}
