import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as CryptoJS from 'crypto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { VkProcess } from './enums/vk.process.enum';
import axios from 'axios';
import * as crypto from 'crypto';

@Injectable()
export class VkService {
  constructor(
    private configService: ConfigService,
    @InjectQueue('vk-request-queue') private vkRequestQueue: Queue,
  ) {}

  private readonly logger = new Logger(VkService.name);

  async verifyLaunchParams(searchOrParsedUrlQuery, secretKey) {
    let sign;
    const queryParams = [];

    /**
     * Функция, которая обрабатывает входящий query-параметр. В случае передачи
     * параметра, отвечающего за подпись, подменяет "sign". В случае встречи
     * корректного в контексте подписи параметра добавляет его в массив
     * известных параметров.
     * @param key
     * @param value
     */
    const processQueryParam = (key, value) => {
      if (typeof value === 'string') {
        if (key === 'sign') {
          sign = value;
        } else if (key.startsWith('vk_')) {
          queryParams.push({ key, value });
        }
      }
    };

    if (typeof searchOrParsedUrlQuery === 'string') {
      // Если строка начинается с вопроса (когда передан window.location.search),
      // его необходимо удалить.
      const formattedSearch = searchOrParsedUrlQuery.startsWith('?')
        ? searchOrParsedUrlQuery.slice(1)
        : searchOrParsedUrlQuery;

      // Пытаемся разобрать строку как query-параметр.
      for (const param of formattedSearch.split('&')) {
        const [key, value] = param.split('=');
        processQueryParam(key, value);
      }
    } else {
      for (const key of Object.keys(searchOrParsedUrlQuery)) {
        const value = searchOrParsedUrlQuery[key];
        processQueryParam(key, value);
      }
    }
    // Обрабатываем исключительный случай, когда не найдена ни подпись в параметрах,
    // ни один параметр, начинающийся с "vk_", чтобы избежать
    // излишней нагрузки, образующейся в процессе работы дальнейшего кода.
    if (!sign || queryParams.length === 0) {
      return false;
    }
    // Снова создаём запрос в виде строки из уже отфильтрованных параметров.
    const queryString = queryParams
      // Сортируем ключи в порядке возрастания.
      .sort((a, b) => a.key.localeCompare(b.key))
      // Воссоздаём новый запрос в виде строки.
      .reduce((acc, { key, value }, idx) => {
        return (
          acc + (idx === 0 ? '' : '&') + `${key}=${encodeURIComponent(value)}`
        );
      }, '');

    // Создаём хеш получившейся строки на основе секретного ключа.
    const paramsHash = crypto
      .createHmac('sha256', secretKey)
      .update(queryString)
      .digest()
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=$/, '');

    return paramsHash === sign;
  }

  async verifyVkToken(launchParams: string, sign: string): Promise<any> {
    // const paramArray = launchParams.split('&');
    // const vkParams = paramArray.filter((param) => param.startsWith('vk_'));
    //
    // vkParams.sort((a, b) => {
    //   const keyA = a.split('=')[0];
    //   const keyB = b.split('=')[0];
    //   return keyA.localeCompare(keyB);
    // });
    // const vkParamsString = vkParams.join('&');
    // const hmac = CryptoJS.HmacSHA256(
    //   vkParamsString,
    //   this.configService.get('vk.miniAppSecret'),
    // );
    // const base64 = CryptoJS.enc.Base64.stringify(hmac);
    //
    // const encryptedLaunchParams = base64
    //   .replace(/\+/g, '-')
    //   .replace(/\//g, '_')
    //   .replace(/=$/, '');
    //
    const splitLaunchParamsString = {};
    for (const [key, value] of new URLSearchParams(launchParams)) {
      splitLaunchParamsString[key] = value;
    }
    // console.log(encryptedLaunchParams);
    // console.log(sign);
    // const isSignValid = encryptedLaunchParams === sign;
    const isSignValid = await this.verifyLaunchParams(
      launchParams + '&sign=' + sign,
      this.configService.get('vk.miniAppSecret'),
    );
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
