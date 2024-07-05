import { Injectable } from '@nestjs/common';
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
import { CancelAchievementDto } from './dtos/cancel-achievement.dto';

@Injectable()
export class AchievementsService {
  constructor(
    @InjectRepository(Achievement)
    private readonly achievementsRepository: Repository<Achievement>,
    @InjectRepository(IssuedAchievement)
    private readonly issuedAchievementsRepository: Repository<IssuedAchievement>,
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

  async getUnlockedAchievements(user: AuthorizedUserDto) {
    const issuedAchievements = await this.issuedAchievementsRepository.find({
      where: { student: user },
      relations: ['achievement', 'issuer', 'student', 'canceler'],
    });
    return issuedAchievements;
  }

  async issueAchievement(
    user: AuthorizedUserDto,
    issueAchievementDto: IssueAchievementDto,
  ) {
    const achievement = await this.achievementsRepository.findOneOrFail({
      where: { uuid: issueAchievementDto.achievementUuid },
    });

    const issuer = await this.userService.getNotStudentUser(user.uuid);

    const student = await this.getStudent(
      issuer,
      issueAchievementDto.studentUuid,
    );

    return await this.issuedAchievementsRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const issuedAchievement = new IssuedAchievement();
        issuedAchievement.achievement = achievement;
        issuedAchievement.issuer = issuer;
        issuedAchievement.student = student;
        issuedAchievement.reward = achievement.reward;
        issuedAchievement.isCanceled = false;
        issuedAchievement.cancellationReason = null;

        await transactionalEntityManager.save(issuedAchievement);

        await transactionalEntityManager
          .createQueryBuilder()
          .update(User)
          .set({ balance: () => `balance + ${achievement.reward}` })
          .where('uuid = :studentUuid', {
            studentUuid: issueAchievementDto.studentUuid,
          })
          .execute();
        return issuedAchievement;
      },
    );
  }

  private async getStudent(issuer: User, studentUuid: string) {
    if (issuer.role === UserRole.CURATOR) {
      return await this.userService.getInstitutesStudent(
        studentUuid,
        issuer.institute,
      );
    } else {
      return await this.userService.getGroupsStudent(
        studentUuid,
        issuer.sputnikGroups,
      );
    }
  }

  async cancelIssuing(
    user: AuthorizedUserDto,
    cancelAchievementDto: CancelAchievementDto,
  ) {
    // const achievement = await this.achievementsRepository.findOneOrFail({
    //   where: { uuid: cancelAchievementDto.achievementUuid },
    // });
    const canceler = await this.userService.getNotStudentUser(user.uuid);
    const student = await this.getStudent(
      canceler,
      cancelAchievementDto.studentUuid,
    );

    // const issuing = await this.issuedAchievementsRepository.findOneOrFail({
    //   where: { student, achievement },
    // });

    const issuing = await this.issuedAchievementsRepository.findOneOrFail({
      where: {
        student: { uuid: student.uuid },
        achievement: {
          uuid: cancelAchievementDto.achievementUuid,
        },
        isCanceled: false,
      },
    });

    return await this.issuedAchievementsRepository.manager.transaction(
      async (transactionalEntityManager) => {
        await transactionalEntityManager.update(
          IssuedAchievement,
          {
            achievement: { uuid: cancelAchievementDto.achievementUuid },
            student: { uuid: student.uuid },
          },
          {
            isCanceled: true,
            canceler: canceler,
            cancellationReason: cancelAchievementDto.cancellationReason,
          },
        );

        await transactionalEntityManager
          .createQueryBuilder()
          .update(User)
          .set({ balance: () => `balance - ${issuing.reward}` })
          .where('uuid = :studentUuid', {
            studentUuid: cancelAchievementDto.studentUuid,
          })
          .execute();
      },
    );
  }
}
