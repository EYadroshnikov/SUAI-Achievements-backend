import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserRole } from './enums/user-role.enum';
import { CreateSputnikDto } from './dtos/create.sputnik.dto';
import { CreateStudentDto } from './dtos/create.student.dto';
import { GroupsService } from '../groups/groups.service';
import { InstitutesService } from '../institues/institutes.service';
import { CreateCuratorDto } from './dtos/create.curator.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly instituteService: InstitutesService,
    private readonly groupsService: GroupsService,
  ) {}

  async createCurator(curatorDto: CreateCuratorDto): Promise<User> {
    const institute = await this.instituteService.findOne(
      curatorDto.instituteId,
    );

    const curator = this.userRepository.create({
      ...curatorDto,
      institute,
      registrationCode: Math.floor(100000 + Math.random() * 900000).toString(),
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
      registrationCode: Math.floor(100000 + Math.random() * 900000).toString(),
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
      registrationCode: Math.floor(100000 + Math.random() * 900000).toString(),
    });

    return this.userRepository.save(student);
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
