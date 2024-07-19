import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as CryptoJS from 'crypto-js';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class VkService {
  constructor(
    private configService: ConfigService,
    @InjectQueue('vk-avatar-queue') private vkAvatarQueue: Queue,
  ) {}

  private readonly logger = new Logger(VkService.name);

  async verifyVkToken(launchParams: string, sign: string): Promise<any> {
    const paramArray = launchParams.split('&');
    const vkParams = paramArray.filter((param) => param.startsWith('vk_'));

    vkParams.sort((a, b) => {
      const keyA = a.split('=')[0];
      const keyB = b.split('=')[0];
      return keyA.localeCompare(keyB);
    });
    const vkParamsString = vkParams.join('&');
    const hmac = CryptoJS.HmacSHA256(
      vkParamsString,
      this.configService.get('vk.miniAppSecret'),
    );
    const base64 = CryptoJS.enc.Base64.stringify(hmac);

    const encryptedLaunchParams = base64
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=$/, '');

    const splitLaunchParamsString = {};
    for (const [key, value] of new URLSearchParams(launchParams)) {
      splitLaunchParamsString[key] = value;
    }
    const isSignValid = encryptedLaunchParams === sign;
    const vkUserID = splitLaunchParamsString['vk_user_id'];
    return { isSignValid, vkUserID };
  }

  async addToVkAvatarQueue(vkId: string) {
    await this.vkAvatarQueue.add({ vkId });
  }
}
