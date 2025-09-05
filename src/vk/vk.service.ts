import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { VkProcess } from './enums/vk.process.enum';
import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { MiniAppPushPermission } from './entities/mini-app-push-permission.entity';
import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class VkService {
  constructor(
    private configService: ConfigService,
    @InjectQueue('vk-request-queue') private vkRequestQueue: Queue,
    @InjectRepository(MiniAppPushPermission)
    private readonly miniAppPushPermissionRepository: Repository<MiniAppPushPermission>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
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
      const formattedSearch = searchOrParsedUrlQuery.startsWith('?')
        ? searchOrParsedUrlQuery.slice(1)
        : searchOrParsedUrlQuery;

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

    if (!sign || queryParams.length === 0) {
      return false;
    }

    const queryString = queryParams
      .sort((a, b) => a.key.localeCompare(b.key))
      .reduce((acc, { key, value }, idx) => {
        return (
          acc + (idx === 0 ? '' : '&') + `${key}=${encodeURIComponent(value)}`
        );
      }, '');

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
    const splitLaunchParamsString = {};
    for (const [key, value] of new URLSearchParams(launchParams)) {
      splitLaunchParamsString[key] = value;
    }

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
      url: 'https://api.vk.ru/method/users.get',
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
      url: 'https://api.vk.ru/method/messages.send',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: data,
    };
    return axios.request(config);
  }

  async sendPush(vkId: string, text: string) {
    const access_token = this.configService.get('vk.miniAppServiceKey');

    const data = new FormData();
    data.append('user_ids', vkId);
    data.append('random_id', '0');
    data.append('message', text);
    data.append('access_token', access_token);
    data.append('v', '5.199');

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://api.vk.ru/method/notifications.sendMessage',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: data,
    };
    return axios.request(config);
  }

  async checkPushPermissionsRequest(vkId: string) {
    const access_token = this.configService.get('vk.miniAppServiceKey');

    const data = new FormData();
    data.append('user_id', vkId);
    data.append('access_token', access_token);
    data.append('v', '5.199');

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://api.vk.ru/method/apps.isNotificationsAllowed',
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

  async addToPushQueue(vkId: string, text: string) {
    await this.vkRequestQueue.add(VkProcess.MINI_APP_PUSH, { vkId, text });
  }

  async checkPushPermissions() {
    const users = await this.usersService.find({ select: ['vkId'] });
    for (const user of users) {
      await this.vkRequestQueue.add(VkProcess.MINI_APP_CHECK_PUSH_PERMISSIONS, {
        vkId: user.vkId,
      });
    }
  }

  async upsertPushPermission(vkId: string, isAllowed: boolean): Promise<void> {
    await this.miniAppPushPermissionRepository.upsert({ vkId, isAllowed }, [
      'vkId',
    ]);
  }
}
