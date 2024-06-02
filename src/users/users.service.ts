import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CuratorDto } from './dtos/curator.dto';
import { plainToClass } from 'class-transformer';
import { UserRole } from './enums/user-role.enum';
import { CreateSputnikDto } from './dtos/create.sputnik.dto';
import { CreateStudentDto } from './dtos/create.student.dto';
import { GroupsService } from '../groups/groups.service';
import { InstitutesService } from '../institues/institutes.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly instituteService: InstitutesService,
    private readonly groupsService: GroupsService,
  ) {}

  async createCurator(curatorDto: CuratorDto): Promise<User> {
    const institute = await this.instituteService.findOne(
      curatorDto.instituteId,
    );

    const curator: User = plainToClass(User, curatorDto);
    curator.institute = institute;
    curator.role = UserRole.CURATOR;
    curator.group = null;
    curator.registrationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString(); // maybe temp
    return this.userRepository.save(curator);
  }

  async createSputnik(sputnikDto: CreateSputnikDto): Promise<User> {
    const institute = await this.instituteService.findOne(
      sputnikDto.instituteId,
    );

    // проверерить что есть такой институт и группа пренадлежит этому институту
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

    const student: User = plainToClass(User, studentDto);
    student.institute = institute;
    student.role = UserRole.STUDENT;
    student.group = group;
    student.registrationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString(); // maybe temp

    return this.userRepository.save(student);
  }

  //   async createUser(data: any): Promise<User> {
  //     // Парсинг данных
  //     const { vkId, firstName, lastName, patronymic, role, instituteId, groupId } = data;
  //
  //     // Создание нового пользователя
  //     const user = new User();
  //     user.vkId = vkId;
  //     user.firstName = firstName;
  //     user.lastName = lastName;
  //     user.patronymic = patronymic;
  //     user.role = role;
  //
  //     // Получение института по ID
  //     const institute = await this.instituteRepository.findOne({ id: instituteId });
  //     if (!institute) {
  //       throw new Error('Institute not found');
  //     }
  //     user.institute = institute;
  //
  //     // Если пользователь имеет роль sputnik, то назначаем его в группу
  //     if (role === UserRole.SPUTNIK) {
  //       const group = await this.groupRepository.findOne({ id: groupId });
  //       if (!group) {
  //         throw new Error('Group not found');
  //       }
  //       user.group = group;
  //     }
  //
  //     // Сохранение пользователя в базе данных
  //     return await this.userRepository.save(user);
  //   }
  // }
}
