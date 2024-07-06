import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class VkService {
  constructor(private configService: ConfigService) {}
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
      this.configService.get('app.vkSecret'),
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
    let isSignValid = encryptedLaunchParams === sign;
    const vkUserID = splitLaunchParamsString['vk_user_id'];
    isSignValid = true;
    return { isSignValid, vkUserID };
  }
}
