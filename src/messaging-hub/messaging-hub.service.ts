import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { TelegramService } from '../telegram/telegram.service';
import { VkService } from '../vk/vk.service';
import { byeTg, byeVk } from './const-messages';

@Injectable()
export class MessagingHubService {
  private readonly logger = new Logger(MessagingHubService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly telegramService: TelegramService,
    private readonly vkService: VkService,
  ) {}

  async broadcastToAllUsers(testUsers: string[] = [], mode: 'TEST' | 'NORMAL') {
    const users = await this.usersService.find({
      select: ['tgId', 'vkId'],
      relations: ['userSettings'],
    });

    const targetUsers =
      mode === 'TEST'
        ? users.filter(
            (user) =>
              testUsers.includes(user.tgId) || testUsers.includes(user.vkId),
          )
        : users;

    this.logger.log(
      `Broadcast mode: ${mode}, target users: ${targetUsers.length}`,
    );

    for (const user of targetUsers) {
      if (user.tgId) {
        await this.telegramService.addToTelegramNotificationQueue(
          user.tgId,
          byeTg,
        );
      }

      if (user.vkId) {
        await this.vkService.addToVkNotificationQueue(user.vkId, byeVk);
        await this.vkService.addToPushQueue(user.vkId, 'Загляни в чат');
      }
    }
  }
}
