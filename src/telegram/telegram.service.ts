import { Injectable } from '@nestjs/common';
import * as crypto from 'node:crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TelegramService {
  constructor(private configService: ConfigService) {}

  async verifyInitData(initData: string) {
    const params = new URLSearchParams(initData);
    const vals: { [key: string]: string } = {};

    params.forEach((value, key) => {
      vals[key] = decodeURIComponent(value);
    });

    // Create data check string excluding 'hash'
    const dataCheckArray = Object.entries(vals)
      .filter(([key]) => key !== 'hash')
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`);
    const dataCheckString = dataCheckArray.join('\n');

    // Calculate HMAC
    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(this.configService.get('app.tgSecret'))
      .digest();
    const hmac = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    const isSignValid = hmac === vals['hash'];
    const tgId = JSON.parse(vals['user']).id;
    return { isSignValid, tgId };
  }
}
