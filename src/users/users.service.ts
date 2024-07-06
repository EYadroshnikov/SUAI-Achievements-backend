import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ArrayContains, In, Not, Repository, UpdateResult } from 'typeorm';
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
import { UserDto } from './dtos/user.dto';
import { UpdateStudentDto } from './dtos/update.student.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly instituteService: InstitutesService,
    @Inject(forwardRef(() => GroupsService))
    private readonly groupsService: GroupsService,
  ) {}

  async findByVkId(vkId: string): Promise<User | undefined> {
    return this.userRepository.findOneOrFail({ where: { vkId: vkId } });
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

    const curator = this.userRepository.create({
      ...curatorDto,
      institute,
      role: UserRole.CURATOR,
    });

    return this.userRepository.save(curator);
  }

  async createSputnik(sputnikDto: CreateSputnikDto): Promise<User> {
    const institute = await this.instituteService.findOne(
      sputnikDto.instituteId,
    );

    const sputnikGroups = await this.groupsService.findAndCountBy(
      sputnikDto.groupIds,
      institute,
    );

    const sputnik = this.userRepository.create({
      ...sputnikDto,
      institute,
      sputnikGroups,
      role: UserRole.SPUTNIK,
    });
    return this.userRepository.save(sputnik);
  }

  async createStudent(studentDto: CreateStudentDto): Promise<User> {
    const institute = await this.instituteService.findOne(
      studentDto.instituteId,
    );
    const group = await this.groupsService.findOne(studentDto.groupId);

    const student = this.userRepository.create({
      ...studentDto,
      institute,
      group,
      role: UserRole.STUDENT,
    });

    return this.userRepository.save(student);
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
}
