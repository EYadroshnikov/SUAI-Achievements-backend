import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import {
  ArrayContains,
  DataSource,
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
  ) {}
  private readonly logger: Logger = new Logger(UsersService.name);

  async findByVkId(vkId: string): Promise<User | undefined> {
    return this.userRepository.findOneOrFail({ where: { vkId: vkId } });
  }

  async findByTgId(tgId: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { tgId: tgId } });
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
    updaterUuid: string,
  ): Promise<UpdateResult> {
    return this.userRepository.update(
      {
        uuid,
        role: UserRole.STUDENT,
        group: { sputniks: ArrayContains([updaterUuid]) },
      },
      {
        firstName: updateStudentDto.firstName,
        lastName: updateStudentDto.lastName,
        patronymic: updateStudentDto.patronymic,
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
    return this.userRepository.update(
      { uuid, role: UserRole.STUDENT },
      { isBanned: true },
    );
  }

  async unbanStudent(uuid: string): Promise<UpdateResult> {
    return this.userRepository.update(
      { uuid, role: UserRole.STUDENT },
      { isBanned: false },
    );
  }

  async getStudentsByGroup(id: number) {
    const group = await this.groupsService.findOne(id);
    const students = await this.userRepository.find({
      where: { group: { id }, role: UserRole.STUDENT },
    });
    return { id: group.id, name: group.name, students: students };
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
    });
  }

  async getCuratorsByInstitute(id: number) {
    await this.instituteService.findOne(id);
    return this.userRepository.find({
      where: { institute: { id }, role: UserRole.CURATOR },
    });
  }

  async getTopStudents(query: PaginateQuery): Promise<Paginated<User>> {
    return paginate<User>(query, this.userRepository, {
      where: { role: UserRole.STUDENT, isBanned: false },
      sortableColumns: ['balance'],
      filterableColumns: {
        'group.id': [FilterOperator.EQ],
        'institute.id': [FilterOperator.EQ],
      },
      defaultSortBy: [['balance', 'DESC']],
      // loadEagerRelations: true,
      relations: ['group', 'institute'],
    });
  }

  async getStudentsTopGroup(id: number) {
    return this.userRepository.find({
      where: { group: { id }, role: UserRole.STUDENT },
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

  async getMyGroupRank(AuthorizedUser: AuthorizedUserDto) {
    const user = await this.userRepository.findOneOrFail({
      where: { uuid: AuthorizedUser.uuid },
    });

    const rank = await this.userRepository
      .createQueryBuilder('user')
      .where('user.group = :groupId', { groupId: user.group.id })
      .andWhere('user.balance > :balance', { balance: user.balance })
      .getCount();

    return { rank: rank + 1 };
  }

  async getMyInstituteRank(AuthorizedUser: AuthorizedUserDto) {
    const user = await this.userRepository.findOneOrFail({
      where: { uuid: AuthorizedUser.uuid },
    });

    const rank = await this.userRepository
      .createQueryBuilder('user')
      .where('user.institute = :groupId', { groupId: user.institute.id })
      .andWhere('user.balance > :balance', { balance: user.balance })
      .getCount();

    return { rank: rank + 1 };
  }

  async getMyRank(AuthorizedUser: AuthorizedUserDto) {
    const user = await this.userRepository.findOneOrFail({
      where: { uuid: AuthorizedUser.uuid },
    });

    const rank = await this.userRepository
      .createQueryBuilder('user')
      .where('user.balance > :balance', { balance: user.balance })
      .getCount();

    return { rank: rank + 1 };
  }

  async setAvatar(vkId: string, avatarUrl: string) {
    return this.userRepository.update({ vkId: vkId }, { avatar: avatarUrl });
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM, { name: 'update avatars' })
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
}
