import { OnQueueError, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { ConfigService } from '@nestjs/config';
import { forwardRef, Inject, Logger } from '@nestjs/common';
import axios from 'axios';
import { UsersService } from '../users/users.service';

@Processor('vk-request-queue')
export class VkRequestProcessor {
  constructor(
    private configService: ConfigService,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) {}

  private readonly logger = new Logger(VkRequestProcessor.name);

  @Process('avatar')
  async handleJob(job: Job) {
    const { vkId } = job.data;
    await this.updateAvatar(vkId);
  }

  @Process('notification')
  async handleNotificationJob(job: Job) {
    const { vkId, text } = job.data;
    await this.notify(vkId, text);
  }

  private async updateAvatar(vkId: string) {
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
    try {
      const res = await axios.request(config);
      await this.usersService.setAvatar(
        vkId,
        res?.data?.response?.[0]?.photo_200,
      );
    } catch (error) {
      this.logger.error(error);
      throw Error;
    }
  }

  private async notify(vkId: string, text: string) {
    const user = await this.usersService.find({
      where: { vkId: vkId },
      loadEagerRelations: false,
      relations: ['userSettings'],
    });
    if (
      user.userSettings &&
      !user.userSettings.receiveVkAchievementNotifications
    ) {
      return;
    }

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
    try {
      const res = await axios.request(config);
    } catch (error) {
      this.logger.error(error);
      throw Error;
    }
  }

  @OnQueueFailed()
  async onQueueFailed(job: Job, error: any) {
    this.logger.error(`Task ${job.id} failed: ${error.message}`, error.stack);
  }

  @OnQueueError()
  async onQueueError(error: any) {
    this.logger.error(error);
  }
}
