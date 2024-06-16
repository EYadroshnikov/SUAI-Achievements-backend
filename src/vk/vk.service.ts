import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class VkService {
  constructor(private configService: ConfigService) {}
  async verifyVkToken(launchParams: string, sign: string): Promise<any> {
    // if (sign === this.configService.get('app.trustedVkSign')) {
    //   return true;
    // }
    const hmac = CryptoJS.HmacSHA256(
      launchParams,
      this.configService.get('app.vkSecret'),
    );
    const base64 = CryptoJS.enc.Base64.stringify(hmac);

    const encryptedLaunchParams = base64
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=$/, '');

    const splitLaunchParamsString = launchParams.split('&');
    const isSignValid = encryptedLaunchParams === sign;
    const vkUserID =
      +splitLaunchParamsString[splitLaunchParamsString.length - 1].split(
        '=',
      )[1];
    return { isSignValid, vkUserID };
    // return { isSignValid: true, vkUserID: 495512276 }; // TODO: replace it
  }
}
