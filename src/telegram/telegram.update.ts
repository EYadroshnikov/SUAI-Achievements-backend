// src/telegram/telegram.update.ts
import { Ctx, Message, On, Start, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { forwardRef, Inject, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TelegramMessageEntity } from './entities/telegram-message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TelegramService } from './telegram.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

@Update()
export class TelegramUpdate {
  constructor(
    @InjectRepository(TelegramMessageEntity)
    private readonly telegramMessageRepository: Repository<TelegramMessageEntity>,
    private readonly telegramService: TelegramService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  private readonly logger = new Logger(TelegramUpdate.name);

  @Start()
  async onStart(@Ctx() ctx: Context) {
    const { id, username, first_name } = ctx.from;
    this.logger.log(`User started bot: ${id} (${username || first_name})`);
  }

  @On('text')
  async onMessage(@Ctx() ctx: Context, @Message('text') msg: string) {
    const userId = ctx.from.id;
    this.logger.log(`Received message from ${userId}: ${msg}`);

    const entity = this.telegramMessageRepository.create({
      tgUserId: String(userId),
      message: msg,
    });
    try {
      await this.telegramMessageRepository.save(entity);
    } catch (error) {
      this.logger.error(error);
    }

    let user: User;
    try {
      user = await this.usersService.findByTgId(String(userId));
    } catch {}

    const fullNameWithLink = user
      ? `<a href="https://vk.ru/id${user.vkId}">${user.firstName} ${user.lastName}</a>`
      : 'Неизвестный';
    await this.telegramService.addToTelegramNotificationQueue(
      '888830551',
      `${fullNameWithLink}: ${msg}`,
    );
  }
}
