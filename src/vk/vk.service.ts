import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as CryptoJS from 'crypto-js';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { VkProcess } from './enums/vk.process.enum';
import axios from 'axios';

@Injectable()
export class VkService {
  constructor(
    private configService: ConfigService,
    @InjectQueue('vk-request-queue') private vkRequestQueue: Queue,
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

  async getAvatar(vkId: string): Promise<string> {
    const access_token = this.configService.get('vk.communityApiKey');

    const data = new FormData();
    data.append('user_ids', vkId);
    data.append('fields', 'photo_200');
    data.append('access_token', access_token);
    data.append('v', '5.199');

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://api.vk.com/method/users.get',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: data,
    };
    const res = await axios.request(config);
    return res?.data?.response?.[0]?.photo_200;
  }

  async sendNotification(vkId: string, text: string) {
    const access_token = this.configService.get('vk.communityApiKey');

    const data = new FormData();
    data.append('user_id', vkId);
    data.append('random_id', '0');
    data.append('message', text);
    data.append('access_token', access_token);
    data.append('v', '5.199');

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://api.vk.com/method/messages.send',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: data,
    };
    return axios.request(config);
  }

  async addToVkAvatarQueue(vkId: string) {
    await this.vkRequestQueue.add(VkProcess.UPDATE_AVATAR, { vkId });
  }

  async addToVkNotificationQueue(vkId: string, text: string) {
    await this.vkRequestQueue.add(VkProcess.NOTIFICATION, { vkId, text });
  }
}
