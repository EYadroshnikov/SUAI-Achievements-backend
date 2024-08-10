import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import {
  ArrayContains,
  DataSource,
  EntityManager,
  In,
  Not,
  Repository,
  UpdateResult,
} from 'typeorm';
import { UserRole } from './enums/user-role.enum';
import { CreateSputnikDto } from './dtos/create.sputnik.dto';
import { CreateStudentDto } from './dtos/create.student.dto';
import { GroupsService } from '../groups/groups.service';
import { InstitutesService } from '../institues/institutes.service';
import { CreateCuratorDto } from './dtos/create.curator.dto';
import { Group } from '../groups/entities/group.entity';
import { Institute } from '../institues/entities/institute.entity';
import {
  FilterOperator,
  paginate,
  Paginated,
  PaginateQuery,
} from 'nestjs-paginate';
import { UpdateStudentDto } from './dtos/update.student.dto';
import { AuthorizedUserDto } from '../common/dtos/authorized-user.dto';
import { VkService } from '../vk/vk.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TelegramService } from '../telegram/telegram.service';
import generateTgBanMessage from '../common/telegram/notification-templates/tg-ban-notification';
import generateVkBanMessage from '../common/vk/notification-templates/vk-ban-notification';
import generateTgUnBanMessage from '../common/telegram/notification-templates/tg-unban-notification';
import generateVkUnBanMessage from '../common/vk/notification-templates/vk-unban-notification';
import { AllRanksDto } from './dtos/all-ranks.dto';
import { UpdateSputnikDto } from './dtos/update.sputnik.dto';
import { RankDto } from './dtos/rank.dto';
import { TopStudentDto } from './dtos/top-student.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly instituteService: InstitutesService,
    @Inject(forwardRef(() => GroupsService))
    private readonly groupsService: GroupsService,
    @Inject(forwardRef(() => VkService))
    private vkService: VkService,
    private telegramService: TelegramService,
  ) {}
  private readonly logger: Logger = new Logger(UsersService.name);

  async findByVkId(vkId: string): Promise<User | undefined> {
    return this.userRepository.findOneOrFail({ where: { vkId: vkId } });
  }

  async findByTgId(tgId: string): Promise<User | undefined> {
    return this.userRepository.findOneOrFail({ where: { tgId: tgId } });
  }

  async findByTgUsername(username: string): Promise<User | undefined> {
    return this.userRepository.findOneOrFail({
      where: { tgUserName: username },
    });
  }

  async getStudent(uuid: string): Promise<User> {
    return this.userRepository.findOneOrFail({
      where: { uuid, role: UserRole.STUDENT },
    });
  }

  async updateStudent(
    uuid: string,
    updateStudentDto: UpdateStudentDto,
    user: AuthorizedUserDto,
  ): Promise<UpdateResult> {
    const criteria = {
      uuid: uuid,
      role: UserRole.STUDENT,
    };
    if (user.role == UserRole.SPUTNIK) {
      criteria['group'] = { sputniks: ArrayContains([user.uuid]) };
    }
    return this.userRepository.update(criteria, {
      firstName: updateStudentDto.firstName,
      lastName: updateStudentDto.lastName,
      patronymic: updateStudentDto.patronymic,
    });
  }

  async updateSputnik(
    uuid: string,
    updateSputnikDto: UpdateSputnikDto,
  ): Promise<UpdateResult> {
    return this.userRepository.update(
      {
        uuid,
        role: UserRole.SPUTNIK,
      },
      {
        firstName: updateSputnikDto.firstName,
        lastName: updateSputnikDto.lastName,
        patronymic: updateSputnikDto.patronymic,
      },
    );
  }

  async updateUserTgId(uuid: string, tgId: string): Promise<UpdateResult> {
    return this.userRepository.update({ uuid }, { tgId: tgId });
  }

  async getGroupsStudent(uuid: string, group: Group[]): Promise<User> {
    return this.userRepository.findOneOrFail({
      where: {
        uuid,
        role: UserRole.STUDENT,
        group: In(group.map((group) => group.id)),
      },
    });
  }

  async getInstitutesStudent(
    uuid: string,
    institute: Institute,
  ): Promise<User> {
    return this.userRepository.findOneOrFail({
      where: { uuid, role: UserRole.STUDENT, institute },
    });
  }

  async getSputnik(uuid: string): Promise<User> {
    return this.userRepository.findOneOrFail({
      where: { uuid },
      relations: ['sputnikGroups'],
    });
  }

  async getCurator(uuid: string): Promise<User> {
    return this.userRepository.findOneOrFail({
      where: { uuid },
    });
  }

  async getNotStudentUser(uuid: string): Promise<User> {
    return this.userRepository.findOneOrFail({
      where: { uuid, role: Not(UserRole.STUDENT) },
      relations: ['sputnikGroups'],
    });
  }

  async updateStudentBalance(studentUuid: string, amount: number) {
    return this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({ balance: () => `balance + ${amount}` })
      .where('uuid = :studentUuid', { studentUuid })
      .execute();
  }

  async createCurator(curatorDto: CreateCuratorDto): Promise<User> {
    const institute = await this.instituteService.findOne(
      curatorDto.instituteId,
    );

    const curatorEntity = this.userRepository.create({
      ...curatorDto,
      institute,
      role: UserRole.CURATOR,
    });

    const curator = await this.userRepository.save(curatorEntity);
    await this.vkService.addToVkAvatarQueue(curatorDto.vkId);
    return curator;
  }

  async createSputnik(sputnikDto: CreateSputnikDto): Promise<User> {
    const institute = await this.instituteService.findOne(
      sputnikDto.instituteId,
    );

    const sputnikGroups = await this.groupsService.findAndCountBy(
      sputnikDto.groupIds,
      institute,
    );

    const sputnikEntity = this.userRepository.create({
      ...sputnikDto,
      institute,
      sputnikGroups,
      role: UserRole.SPUTNIK,
    });
    const sputnik = await this.userRepository.save(sputnikEntity);
    await this.vkService.addToVkAvatarQueue(sputnikDto.vkId);
    return sputnik;
  }

  async createStudent(studentDto: CreateStudentDto): Promise<User> {
    const institute = await this.instituteService.findOne(
      studentDto.instituteId,
    );
    const group = await this.groupsService.findOne(studentDto.groupId);

    const studentEntity = this.userRepository.create({
      ...studentDto,
      institute,
      group,
      role: UserRole.STUDENT,
    });

    const student = await this.userRepository.save(studentEntity);
    await this.vkService.addToVkAvatarQueue(studentDto.vkId);
    return student;
  }

  async banStudent(uuid: string): Promise<UpdateResult> {
    const result = await this.userRepository.update(
      { uuid, role: UserRole.STUDENT },
      { isBanned: true },
    );

    const student = await this.userRepository.findOneOrFail({
      where: { uuid },
    });
    if (student.tgId) {
      await this.telegramService.addToTelegramNotificationQueue(
        student.tgId,
        generateTgBanMessage(),
      );
    }
    await this.vkService.addToVkNotificationQueue(
      student.vkId,
      generateVkBanMessage(),
    );
    return result;
  }

  async unbanStudent(uuid: string): Promise<UpdateResult> {
    const result = await this.userRepository.update(
      { uuid, role: UserRole.STUDENT },
      { isBanned: false },
    );

    const student = await this.userRepository.findOneOrFail({
      where: { uuid },
    });
    if (student.tgId) {
      await this.telegramService.addToTelegramNotificationQueue(
        student.tgId,
        generateTgUnBanMessage(),
      );
    }
    await this.vkService.addToVkNotificationQueue(
      student.vkId,
      generateVkUnBanMessage(),
    );
    return result;
  }

  async banSputnik(uuid: string): Promise<UpdateResult> {
    const result = await this.userRepository.update(
      { uuid, role: UserRole.SPUTNIK },
      { isBanned: true },
    );

    const sputnik = await this.userRepository.findOneOrFail({
      where: { uuid },
    });
    if (sputnik.tgId) {
      await this.telegramService.addToTelegramNotificationQueue(
        sputnik.tgId,
        generateTgBanMessage(),
      );
    }
    await this.vkService.addToVkNotificationQueue(
      sputnik.vkId,
      generateVkBanMessage(),
    );
    return result;
  }

  async unbanSputnik(uuid: string): Promise<UpdateResult> {
    const result = await this.userRepository.update(
      { uuid, role: UserRole.SPUTNIK },
      { isBanned: false },
    );

    const sputnik = await this.userRepository.findOneOrFail({
      where: { uuid },
    });
    if (sputnik.tgId) {
      await this.telegramService.addToTelegramNotificationQueue(
        sputnik.tgId,
        generateTgUnBanMessage(),
      );
    }
    await this.vkService.addToVkNotificationQueue(
      sputnik.vkId,
      generateVkUnBanMessage(),
    );
    return result;
  }

  async getStudentsByGroup(id: number) {
    return this.userRepository.find({
      where: { group: { id }, role: UserRole.STUDENT },
    });
  }

  async getStudentsByInstitute(
    id: number,
    query: PaginateQuery,
  ): Promise<Paginated<User>> {
    await this.instituteService.findOne(id);
    return paginate<User>(query, this.userRepository, {
      where: { role: UserRole.STUDENT, isBanned: false, institute: { id } },
      filterableColumns: {
        'group.id': [FilterOperator.EQ],
      },
      sortableColumns: ['createdAt'],
      defaultSortBy: [['createdAt', 'DESC']],
      relations: ['institute'],
    });
  }

  async getSputniksByGroup(id: number) {
    await this.groupsService.findOne(id);
    return this.userRepository.find({
      where: { sputnikGroups: { id }, role: UserRole.SPUTNIK },
      relations: ['sputnikGroups'],
    });
  }

  async getSputniksByInstitute(id: number) {
    await this.instituteService.findOne(id);
    return this.userRepository.find({
      where: { institute: { id }, role: UserRole.SPUTNIK },
      relations: ['sputnikGroups'],
    });
  }

  async getCuratorsByInstitute(id: number) {
    await this.instituteService.findOne(id);
    return this.userRepository.find({
      where: { institute: { id }, role: UserRole.CURATOR },
    });
  }

  async getTopStudents(
    query: PaginateQuery,
  ): Promise<Paginated<TopStudentDto>> {
    const paginatedUsers = await paginate<User>(query, this.userRepository, {
      where: { role: UserRole.STUDENT, isBanned: false },
      sortableColumns: ['balance'],
      filterableColumns: {
        'group.id': [FilterOperator.EQ],
        'institute.id': [FilterOperator.EQ],
      },
      defaultSortBy: [['balance', 'DESC']],
      // loadEagerRelations: true,
      relations: ['group', 'institute', 'userSettings'],
    });
    const topStudents = paginatedUsers.data.map((user) => {
      const dto = new TopStudentDto();
      dto.balance = user.balance;
      dto.userSettings = user.userSettings;
      if (user.userSettings && user.userSettings.isVisibleInTop) {
        dto.firstName = user.firstName;
        dto.lastName = user.lastName;
        dto.avatar = user.avatar;
      } else {
        dto.firstName = null;
        dto.lastName = null;
        dto.avatar = null;
      }

      return dto;
    });
    return {
      ...paginatedUsers,
      data: topStudents,
      meta: {
        ...paginatedUsers.meta,
        sortBy: [['balance', 'DESC']],
        searchBy: [],
      },
    };
  }

  async getStudentsTopGroup(id: number) {
    return this.userRepository.find({
      where: { group: { id }, role: UserRole.STUDENT, isBanned: false },
      order: { balance: 'DESC' },
    });
  }

  async countStudentsInGroup(groups: Group[]) {
    return this.dataSource.transaction(async (manager) => {
      const usersRepository = manager.getRepository(User);
      const countPromises = groups.map(async (group: Group) => {
        const studentsCount = await usersRepository.count({
          where: {
            role: UserRole.STUDENT,
            group: { id: group.id },
          },
        });
        return { ...group, studentsCount };
      });
      return Promise.all(countPromises);
    });
  }

  async getRankTransaction(
    user: User,
    scope: 'group' | 'institute' | 'university',
    transactionEntityManager: EntityManager,
  ): Promise<[number, number]> {
    const rankQueryBuilder = transactionEntityManager
      .createQueryBuilder(User, 'user')
      .where('user.balance > :balance', { balance: user.balance })
      .andWhere('user.isBanned = :isBanned', { isBanned: false })
      .andWhere('user.role = :role', { role: UserRole.STUDENT });

    const totalQueryBuilder = transactionEntityManager
      .createQueryBuilder(User, 'user')
      .where('user.isBanned = :isBanned', { isBanned: false })
      .andWhere('user.role = :role', { role: UserRole.STUDENT });

    if (scope === 'institute') {
      rankQueryBuilder.andWhere('user.institute = :instituteId', {
        instituteId: user.institute.id,
      });
      totalQueryBuilder.andWhere('user.institute = :instituteId', {
        instituteId: user.institute.id,
      });
    } else if (scope === 'group') {
      rankQueryBuilder.andWhere('user.group = :groupId', {
        groupId: user.group.id,
      });
      totalQueryBuilder.andWhere('user.group = :groupId', {
        groupId: user.group.id,
      });
    }

    return Promise.all([
      rankQueryBuilder.getCount(),
      totalQueryBuilder.getCount(),
    ]);
  }

  async getRank(
    uuid: string,
    scope: 'group' | 'institute' | 'university',
  ): Promise<RankDto> {
    return this.userRepository.manager.transaction(
      async (transactionEntityManager) => {
        const user = await transactionEntityManager.findOneOrFail(User, {
          where: { uuid },
        });
        const [rank, total] = await this.getRankTransaction(
          user,
          scope,
          transactionEntityManager,
        );
        return { rank: rank + 1, total: total };
      },
    );
  }

  async getAllRanks(uuid: string): Promise<AllRanksDto> {
    return this.userRepository.manager.transaction(
      async (transactionEntityManager) => {
        const user = await transactionEntityManager.findOneOrFail(User, {
          where: { uuid },
        });

        const [groupRank, instituteRank, universityRank] = await Promise.all([
          this.getRankTransaction(user, 'group', transactionEntityManager),
          this.getRankTransaction(user, 'institute', transactionEntityManager),
          this.getRankTransaction(user, 'university', transactionEntityManager),
        ]);

        return {
          groupRank: { rank: groupRank[0] + 1, total: groupRank[1] },
          instituteRank: {
            rank: instituteRank[0] + 1,
            total: instituteRank[1],
          },
          universityRank: {
            rank: universityRank[0] + 1,
            total: universityRank[1],
          },
        };
      },
    );
  }

  async setAvatar(vkId: string, avatarUrl: string) {
    return this.userRepository.update({ vkId: vkId }, { avatar: avatarUrl });
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM, {
    name: 'update avatars',
    timeZone: 'Europe/Moscow',
  })
  async updateAvatars() {
    this.logger.log('cron task: update avatars has started');
    const vkIds = await this.userRepository
      .createQueryBuilder('user')
      .select('user.vkId')
      .getRawMany();

    for (const vkId of vkIds) {
      await this.vkService.addToVkAvatarQueue(vkId['user_vk_id']);
    }
    this.logger.log(`${vkIds.length} avatar updates were added in queue`);
  }

  async deleteStudent(uuid: string) {
    return this.userRepository.delete({ uuid });
  }
}
