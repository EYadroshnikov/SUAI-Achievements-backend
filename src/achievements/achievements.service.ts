import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
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
import { TelegramService } from '../telegram/telegram.service';
import generateTgIssueMessage from '../common/telegram/notification-templates/tg-issue-achievement-notification';
import generateTgCancelMessage from '../common/telegram/notification-templates/tg-cancel-achievement-notification';
import { VkService } from '../vk/vk.service';
import generateVkIssueMessage from '../common/vk/notification-templates/vk-issue-achievement-notification';
import generateVkCancelMessage from '../common/vk/notification-templates/vk-cancel-achievement-notification';
import { AchievementOperation } from './entities/achievement-operation.entity';
import { AchievementOperationType } from './enums/achievement-operation-type.enum';
import {
  FilterOperator,
  paginate,
  PaginateConfig,
  Paginated,
  PaginateQuery,
} from 'nestjs-paginate';

@Injectable()
export class AchievementsService {
  constructor(
    @InjectRepository(Achievement)
    private readonly achievementsRepository: Repository<Achievement>,
    @InjectRepository(IssuedAchievement)
    private readonly issuedAchievementsRepository: Repository<IssuedAchievement>,
    @InjectRepository(AchievementOperation)
    private readonly achievementOperationsRepository: Repository<AchievementOperation>,
    private readonly userService: UsersService,
    private readonly telegramService: TelegramService,
    private readonly vkService: VkService,
  ) {}

  static OPERATION_PAGINATION_CONFIG = {
    sortableColumns: ['createdAt'],
    filterableColumns: {
      type: [FilterOperator.EQ, FilterOperator.IN],
      'executor.(uuid)': [FilterOperator.EQ, FilterOperator.IN],
      'student.(uuid)': [FilterOperator.EQ, FilterOperator.IN],
      'achievement.(uuid)': [FilterOperator.EQ, FilterOperator.IN],
    },
    defaultSortBy: [['createdAt', 'DESC']],
    relations: ['executor', 'achievement', 'student'],
  } as PaginateConfig<AchievementOperation>;

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

  async getUnlockedAchievements(user: AuthorizedUserDto) {
    return this.issuedAchievementsRepository.find({
      where: { student: user },
      relations: ['achievement', 'issuer', 'student'],
    });
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

    const result = await this.issuedAchievementsRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const issuedAchievement = new IssuedAchievement();
        issuedAchievement.achievement = achievement;
        issuedAchievement.issuer = issuer;
        issuedAchievement.student = student;
        issuedAchievement.reward = achievement.reward;

        await transactionalEntityManager.save(issuedAchievement);

        const achievementOperation = new AchievementOperation();
        achievementOperation.type = AchievementOperationType.ISSUE;
        achievementOperation.achievement = achievement;
        achievementOperation.executor = issuer;
        achievementOperation.student = student;
        achievementOperation.cancellationReason = null;

        await transactionalEntityManager.save(achievementOperation);

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
    if (student.tgId) {
      await this.telegramService.addToTelegramNotificationQueue(
        student.tgId,
        generateTgIssueMessage(result),
      );
    }
    await this.vkService.addToVkNotificationQueue(
      student.vkId,
      generateVkIssueMessage(result),
    );
    return result;
  }

  // async achievementNotify(
  //   student: User,
  //   issuedAchievement: IssuedAchievementDto,
  // );

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
    const canceler = await this.userService.getNotStudentUser(user.uuid);
    const student = await this.getStudent(
      canceler,
      cancelAchievementDto.studentUuid,
    );

    const issuing = await this.issuedAchievementsRepository.findOneOrFail({
      where: {
        student: { uuid: student.uuid },
        achievement: {
          uuid: cancelAchievementDto.achievementUuid,
        },
      },
    });

    const achievement = await this.achievementsRepository.findOneOrFail({
      where: { uuid: cancelAchievementDto.achievementUuid },
    });

    const result = await this.issuedAchievementsRepository.manager.transaction(
      async (transactionalEntityManager) => {
        await transactionalEntityManager.delete(IssuedAchievement, {
          achievement: { uuid: cancelAchievementDto.achievementUuid },
          student: { uuid: student.uuid },
        });

        await transactionalEntityManager
          .createQueryBuilder()
          .update(User)
          .set({ balance: () => `balance - ${issuing.reward}` })
          .where('uuid = :studentUuid', {
            studentUuid: cancelAchievementDto.studentUuid,
          })
          .execute();

        const achievementOperation = new AchievementOperation();
        achievementOperation.type = AchievementOperationType.CANCEL;
        achievementOperation.cancellationReason =
          cancelAchievementDto.cancellationReason;
        achievementOperation.achievement = achievement;
        achievementOperation.executor = canceler;
        achievementOperation.student = student;

        await transactionalEntityManager.save(achievementOperation);
      },
    );

    if (student.tgId) {
      await this.telegramService.addToTelegramNotificationQueue(
        student.tgId,
        generateTgCancelMessage(
          achievement,
          canceler,
          cancelAchievementDto.cancellationReason,
        ),
      );
    }
    await this.vkService.addToVkNotificationQueue(
      student.vkId,
      generateVkCancelMessage(
        achievement,
        canceler,
        cancelAchievementDto.cancellationReason,
      ),
    );
    return result;
  }

  async getPaginatedOperation(
    query: PaginateQuery,
    user: AuthorizedUserDto,
  ): Promise<Paginated<AchievementOperation>> {
    const curator = await this.userService.getCurator(user.uuid);
    const queryBuilder = this.achievementOperationsRepository
      .createQueryBuilder('operation')
      .innerJoin('operation.student', 'student')
      .innerJoin('student.institute', 'institute')
      .where('student.institute.id = :id', { id: curator.institute.id });

    return paginate<AchievementOperation>(
      query,
      queryBuilder,
      AchievementsService.OPERATION_PAGINATION_CONFIG,
    );
  }

  async getUnseenIssuedAchievements(user: AuthorizedUserDto) {
    return this.issuedAchievementsRepository.find({
      where: { student: { uuid: user.uuid }, seen: false },
      relations: ['achievement', 'issuer', 'student'],
    });
  }

  async markAsSeen(user: AuthorizedUserDto, uuids: string[]) {
    return this.issuedAchievementsRepository.update(
      {
        student: { uuid: user.uuid },
        uuid: In(uuids),
        seen: false,
      },
      { seen: true },
    );
  }
}
