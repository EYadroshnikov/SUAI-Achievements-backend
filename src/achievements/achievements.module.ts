import { Module } from '@nestjs/common';
import { AchievementsService } from './achievements.service';
import { AchievementsController } from './achievements.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Achievement } from './entities/achievement.entity';
import { IssuedAchievement } from './entities/issued-achievement.entity';
import { UsersModule } from '../users/users.module';
import { User } from '../users/entities/user.entity';
import { TelegramModule } from '../telegram/telegram.module';
import { VkModule } from '../vk/vk.module';
import { AchievementOperation } from './entities/achievement-operation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Achievement,
      IssuedAchievement,
      User, //TODO: check if I can remove User Entity from here
      AchievementOperation,
    ]),
    UsersModule,
    TelegramModule,
    VkModule,
  ],
  controllers: [AchievementsController],
  providers: [AchievementsService],
})
export class AchievementsModule {}
