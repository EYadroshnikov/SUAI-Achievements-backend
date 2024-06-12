import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { In, Not, Repository, UpdateResult } from 'typeorm';
import { UserRole } from './enums/user-role.enum';
import { CreateSputnikDto } from './dtos/create.sputnik.dto';
import { CreateStudentDto } from './dtos/create.student.dto';
import { GroupsService } from '../groups/groups.service';
import { InstitutesService } from '../institues/institutes.service';
import { CreateCuratorDto } from './dtos/create.curator.dto';
import { Group } from '../groups/entities/group.entity';
import { Institute } from '../institues/entities/institute.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly instituteService: InstitutesService,
    private readonly groupsService: GroupsService,
  ) {}

  async findByVkId(vkId: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { vkId: vkId } });
  }

  async getStudent(uuid: string): Promise<User> {
    return this.userRepository.findOneOrFail({
      where: { uuid, role: UserRole.STUDENT },
    });
  }

  async getGroupsStudent(uuid: string, group: Group[]): Promise<User> {
    return this.userRepository.findOneOrFail({
      where: { uuid, role: UserRole.STUDENT, group: In(group) },
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
    return this.userRepository.findOne({
      where: { uuid },
      relations: ['sputnikGroups'],
    });
  }

  async getCurator(uuid: string): Promise<User> {
    return this.userRepository.findOne({
      where: { uuid },
    });
  }

  async getNotStudentUser(uuid: string): Promise<User> {
    return this.userRepository.findOneOrFail({
      where: { uuid, role: Not(UserRole.STUDENT) },
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
    await this.groupsService.findOne(id);
    return this.userRepository.find({
      where: { group: { id }, role: UserRole.STUDENT },
    });
  }

  async getStudentsByInstitute(id: number) {
    await this.instituteService.findOne(id);
    return this.userRepository.find({
      where: { institute: { id }, role: UserRole.STUDENT },
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
}
