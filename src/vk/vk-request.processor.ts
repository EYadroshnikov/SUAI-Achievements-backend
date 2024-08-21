import { OnQueueError, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { ConfigService } from '@nestjs/config';
import { forwardRef, Inject, Logger } from '@nestjs/common';
import axios from 'axios';
import { UsersService } from '../users/users.service';
import { VkProcess } from './enums/vk.process.enum';
import { VkService } from './vk.service';

@Processor('vk-request-queue')
export class VkRequestProcessor {
  constructor(
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly vkService: VkService,
  ) {}

  private readonly logger = new Logger(VkRequestProcessor.name);

  @Process(VkProcess.UPDATE_AVATAR)
  async handleJob(job: Job) {
    const { vkId } = job.data;
    await this.updateAvatar(vkId);
  }

  @Process(VkProcess.NOTIFICATION)
  async handleNotificationJob(job: Job) {
    const { vkId, text } = job.data;
    await this.notify(vkId, text);
  }

  private async updateAvatar(vkId: string) {
    try {
      const avatarUrl = await this.vkService.getAvatar(vkId);
      await this.usersService.setAvatar(vkId, avatarUrl);
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

    try {
      await this.vkService.sendNotification(vkId, text);
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
