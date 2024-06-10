import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Achievement } from './entities/achievement.entity';
import { IssuedAchievement } from './entities/issued-achievement.entity';
import { UserRole } from '../users/enums/user-role.enum';
import { AchievementDto } from './dtos/achievement.dto';
import { AchievementType } from './enums/achievement-type.enum';
import { AuthorizedUserDto } from '../common/dtos/authorized-user.dto';

@Injectable()
export class AchievementsService {
  constructor(
    @InjectRepository(Achievement)
    private readonly achievementsRepository: Repository<Achievement>,
    @InjectRepository(IssuedAchievement)
    private readonly issuedAchievementsRepository: Repository<IssuedAchievement>,
  ) {}

  async getAchievementsForUser(
    user: AuthorizedUserDto,
  ): Promise<AchievementDto[]> {
    const achievements = await this.achievementsRepository.find();

    if (user.role !== UserRole.STUDENT) {
      return achievements;
    }

    const issuedAchievements = await this.issuedAchievementsRepository.find({
      where: { student: user },
      relations: ['achievement'],
    });

    const issuedAchievementMap = new Map<string, IssuedAchievement>();
    issuedAchievements.forEach((ia) => {
      issuedAchievementMap.set(ia.achievement.uuid, ia);
    });

    return achievements.map((achievement) => {
      const issuedAchievement = issuedAchievementMap.get(achievement.uuid);
      return this.formatAchievementDto(achievement, user, !!issuedAchievement);
    });
  }

  private formatAchievementDto(
    achievement: Achievement,
    user: AuthorizedUserDto,
    isReceived: boolean,
  ): AchievementDto {
    const dto: AchievementDto = {
      uuid: achievement.uuid,
      name: null,
      type: achievement.type,
      category: achievement.category,
      rarity: achievement.rarity,
      reward: null,
      hiddenIconPath: achievement.hiddenIconPath,
      openedIconPath: null,
      studentRequirement: null,
      hint: null,
      roflDescription: null,
    };

    if (user.role !== UserRole.STUDENT) {
      return { ...dto, ...achievement };
    }

    if (isReceived) {
      return {
        ...dto,
        name: achievement.name,
        reward: achievement.reward,
        openedIconPath: achievement.openedIconPath,
        studentRequirement: achievement.studentRequirement,
        hint: achievement.hint,
        roflDescription: achievement.roflDescription,
      };
    }

    if (achievement.type === AchievementType.OPENED) {
      return {
        ...dto,
        name: achievement.name,
        studentRequirement: achievement.studentRequirement,
      };
    }

    if (achievement.type === AchievementType.HINTED) {
      return {
        ...dto,
        name: achievement.name,
        hint: achievement.hint,
      };
    }

    return dto;
  }
}
