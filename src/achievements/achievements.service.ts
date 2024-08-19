import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, Not, Repository } from 'typeorm';
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
    if (user.role !== UserRole.STUDENT) {
      return this.achievementsRepository.find();
    }
    const { achievements, issuedAchievements } =
      await this.achievementsRepository.manager.transaction(async (manager) => {
        const [achievements, issuedAchievements] = await Promise.all([
          manager.find(Achievement),
          manager.find(IssuedAchievement, {
            where: { student: { uuid: user.uuid } },
            relations: ['achievement'],
          }),
        ]);

        return { achievements, issuedAchievements };
      });

    const issuedAchievementMap = new Map<string, IssuedAchievement>();
    issuedAchievements.forEach((ia) => {
      issuedAchievementMap.set(ia.achievement.uuid, ia);
    });

    return achievements.map((achievement) => {
      const issuedAchievement = issuedAchievementMap.get(achievement.uuid);
      return this.formatAchievementDto(achievement, !!issuedAchievement);
    });
  }

  private formatAchievementDto(
    achievement: Achievement,
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
      sputnikRequirement: null,
      studentRequirement: null,
      hint: null,
      roflDescription: null,
    };

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

  async getUnlockedAchievements(studentUuid: string) {
    return this.issuedAchievementsRepository.find({
      where: { student: { uuid: studentUuid } },
      relations: ['achievement', 'issuer', 'student'],
    });
  }

  async issueAchievement(
    user: AuthorizedUserDto,
    issueAchievementDto: IssueAchievementDto,
  ) {
    const result = await this.issuedAchievementsRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const achievement = await transactionalEntityManager.findOneOrFail(
          Achievement,
          {
            where: { uuid: issueAchievementDto.achievementUuid },
          },
        );

        const issuer = await this.userService.find(
          {
            where: { uuid: user.uuid, role: Not(UserRole.STUDENT) },
            loadEagerRelations: false,
            relations: ['institute', 'sputnikGroups'],
          },
          transactionalEntityManager,
        );

        const student = await this.getStudent(
          issuer,
          issueAchievementDto.studentUuid,
          transactionalEntityManager,
        );

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
        return { issuedAchievement, student, issuer };
      },
    );
    if (result.student.tgId) {
      await this.telegramService.addToTelegramNotificationQueue(
        result.student.tgId,
        generateTgIssueMessage(result.issuedAchievement),
      );
    }
    await this.vkService.addToVkNotificationQueue(
      result.student.vkId,
      generateVkIssueMessage(result.issuedAchievement),
    );
    return result;
  }

  private async getStudent(
    issuer: User,
    studentUuid: string,
    manager: EntityManager,
  ) {
    if (issuer.role === UserRole.CURATOR) {
      return this.userService.find(
        {
          where: {
            uuid: studentUuid,
            institute: { id: issuer.institute.id },
            role: UserRole.STUDENT,
          },
          loadEagerRelations: false,
        },
        manager,
      );
    } else {
      return this.userService.find(
        {
          where: {
            uuid: studentUuid,
            role: UserRole.STUDENT,
            group: In(issuer.sputnikGroups.map((group) => group.id)),
          },
          loadEagerRelations: false,
        },
        manager,
      );
    }
  }

  async cancelIssuing(
    user: AuthorizedUserDto,
    cancelAchievementDto: CancelAchievementDto,
  ) {
    const result = await this.issuedAchievementsRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const canceler = await this.userService.find(
          {
            where: { uuid: user.uuid, role: Not(UserRole.STUDENT) },
            loadEagerRelations: false,
            relations: ['institute', 'sputnikGroups'],
          },
          transactionalEntityManager,
        );
        const student = await this.getStudent(
          canceler,
          cancelAchievementDto.studentUuid,
          transactionalEntityManager,
        );

        const issuing = await transactionalEntityManager.findOneOrFail(
          IssuedAchievement,
          {
            where: {
              student: { uuid: student.uuid },
              achievement: {
                uuid: cancelAchievementDto.achievementUuid,
              },
            },
          },
        );

        const achievement = await transactionalEntityManager.findOneOrFail(
          Achievement,
          {
            where: { uuid: cancelAchievementDto.achievementUuid },
          },
        );

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
        return { student, canceler, achievement };
      },
    );

    if (result.student.tgId) {
      await this.telegramService.addToTelegramNotificationQueue(
        result.student.tgId,
        generateTgCancelMessage(
          result.achievement,
          result.canceler,
          cancelAchievementDto.cancellationReason,
        ),
      );
    }
    await this.vkService.addToVkNotificationQueue(
      result.student.vkId,
      generateVkCancelMessage(
        result.achievement,
        result.canceler,
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
