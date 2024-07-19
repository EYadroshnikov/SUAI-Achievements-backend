import { OnQueueError, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { ConfigService } from '@nestjs/config';
import { forwardRef, Inject, Logger } from '@nestjs/common';
import axios from 'axios';
import { UsersService } from '../users/users.service';

@Processor('vk-avatar-queue')
export class VkAvatarProcessor {
  constructor(
    private configService: ConfigService,
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
  ) {}

  private readonly logger = new Logger(VkAvatarProcessor.name);

  @Process()
  async handleJob(job: Job) {
    const { vkId } = job.data;
    await this.sendMessage(vkId);
  }

  private async sendMessage(vkId: string) {
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
      await this.userService.setAvatar(
        vkId,
        res?.data?.response?.[0]?.photo_200,
      );
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
