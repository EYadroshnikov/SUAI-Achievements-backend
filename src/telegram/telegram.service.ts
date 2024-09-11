import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'node:crypto';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { TelegramProcess } from './enums/telegram.process.enum';
import axios from 'axios';

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
    const tgId = JSON.parse(vals['user']).id;
    if (!tgId) {
      throw new UnauthorizedException('No tg id provided');
    }

    if (Math.floor(Date.now() / 1000) - +vals['auth_date'] > 5 * 60) {
      return { isSignValid: false };
    }

    // Create data check string excluding 'hash'
    const dataCheckArray = Object.entries(vals)
      .filter(([key]) => key !== 'hash')
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`);
    const dataCheckString = dataCheckArray.join('\n');

    // Calculate HMAC
    const hmac = await this.calculateHmac(
      dataCheckString,
      this.configService.get('tg.botSecret'),
    );

    let isSignValid = hmac === vals['hash'];
    if (!isSignValid) {
      const secondHmac = await this.calculateHmac(
        dataCheckString,
        this.configService.get('tg.devBotSecret'),
      );
      isSignValid = secondHmac === vals['hash'];
    }

    return { isSignValid, tgId };
  }

  async calculateHmac(
    dataCheckString: string,
    secret: string,
  ): Promise<string> {
    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(secret)
      .digest();
    const hmac = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');
    return hmac;
  }

  async sendNotification(tgUserId: string, text: string) {
    const url = `https://api.telegram.org/bot${this.configService.get('tg.botSecret', { infer: true })}/sendMessage`;

    const payload = {
      chat_id: tgUserId,
      text: text,
      parse_mode: 'html', // html | markdown
    };
    return axios.post(url, payload);
  }

  async addToTelegramNotificationQueue(tgUserId: string, text: string) {
    return this.telegramNotificationQueue.add(TelegramProcess.NOTIFICATION, {
      tgUserId,
      text,
    });
  }
}
