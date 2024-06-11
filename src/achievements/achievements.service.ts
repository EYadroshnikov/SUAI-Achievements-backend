import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Achievement } from './entities/achievement.entity';
import { IssuedAchievement } from './entities/issued-achievement.entity';
import { UserRole } from '../users/enums/user-role.enum';
import { AchievementDto } from './dtos/achievement.dto';
import { AchievementType } from './enums/achievement-type.enum';
import { AuthorizedUserDto } from '../common/dtos/authorized-user.dto';
import { IssueAchievementDto } from './dtos/issue-achievement.dto';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AchievementsService {
  constructor(
    @InjectRepository(Achievement)
    private readonly achievementsRepository: Repository<Achievement>,
    @InjectRepository(IssuedAchievement)
    private readonly issuedAchievementsRepository: Repository<IssuedAchievement>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UsersService,
  ) {}

  async getAchievementsForUser(
    user: AuthorizedUserDto,
  ): Promise<AchievementDto[]> {
    const achievements = await this.achievementsRepository.find();

    if (user.role !== UserRole.STUDENT) {
      return achievements;
    }

    const issuedAchievements = await this.issuedAchievementsRepository.find({
      where: { student: user, isCanceled: false },
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

  async issueAchievement(
    user: AuthorizedUserDto,
    issueAchievementDto: IssueAchievementDto,
  ) {
    const achievement = await this.achievementsRepository.findOneOrFail({
      where: { uuid: issueAchievementDto.achievementUuid },
    });

    const student = await this.userService.getStudent(
      issueAchievementDto.studentUuid,
    );

    const issuer = await this.userService.getNotStudentUser(user.uuid);

    return await this.issuedAchievementsRepository.manager.transaction(
      async (transactionalEntityManager) => {
        await transactionalEntityManager
          .createQueryBuilder()
          .update(User)
          .set({ balance: () => `balance + ${achievement.reward}` })
          .where('uuid = :studentUuid', {
            studentUuid: issueAchievementDto.studentUuid,
          })
          .execute();

        const issuedAchievement = new IssuedAchievement();
        issuedAchievement.achievement = achievement;
        issuedAchievement.issuer = issuer;
        issuedAchievement.student = student;
        issuedAchievement.reward = achievement.reward;
        issuedAchievement.isCanceled = false;
        issuedAchievement.cancellationReason = null;

        await transactionalEntityManager.save(issuedAchievement);

        return issuedAchievement;
      },
    );
  }
}
