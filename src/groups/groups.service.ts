import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateGroupDto } from './dtos/create-group.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { Group } from './entities/group.entity';
import { Institute } from '../institues/entities/institute.entity';
import { InstitutesService } from '../institues/institutes.service';
import { UsersService } from '../users/users.service';
import { AddSputnikDto } from './dtos/add-sputnik.dto';
import { SpecialtiesService } from '../specialties/specialties.service';
import { UserRole } from '../users/enums/user-role.enum';
import { User } from '../users/entities/user.entity';

@Injectable()
export class GroupsService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    private instituteService: InstitutesService,
    private specialtiesService: SpecialtiesService,
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
  ) {}

  async findOne(id: number) {
    return this.groupRepository.findOneOrFail({ where: { id } });
  }

  async findAndCountBy(ids: number[], institute: Institute) {
    const [sputnikGroups, groupsCount] =
      await this.groupRepository.findAndCountBy({
        id: In(ids),
        institute: institute,
      });

    if (groupsCount != ids.length) {
      throw new BadRequestException(
        'One or more groups does not exist or it does not belong to this institute',
      );
    }
    return sputnikGroups;
  }

  async create(createGroupDto: CreateGroupDto): Promise<Group> {
    const institute = await this.instituteService.findOne(
      createGroupDto.instituteId,
    );
    const speciality = await this.specialtiesService.findOne(
      createGroupDto.specialityId,
    );

    const group = new Group();
    group.name = createGroupDto.name;
    group.institute = institute;
    group.speciality = speciality;

    return this.groupRepository.save(group);
  }

  async getGroupsByInstitute(id: number) {
    await this.instituteService.findOne(id);
    const groups = await this.groupRepository.find({
      where: { institute: { id } },
      relations: ['sputniks'],
    });
    return this.userService.countStudentsInGroup(groups);
  }

  async getGroup(id: number) {
    const group = await this.groupRepository.findOneOrFail({
      where: { id },
      relations: ['sputniks', 'students'],
    });
    return { ...group, studentsCount: group.students.length };
  }

  async addSputnik(addSputnikDto: AddSputnikDto): Promise<Group> {
    const { sputnikUuid, groupId } = addSputnikDto;

    const sputnik = await this.userService.getSputnik(sputnikUuid);

    const group = await this.groupRepository.findOneOrFail({
      where: { id: groupId, institute: { id: sputnik.institute.id } },
      relations: ['sputniks'],
    });

    group.sputniks.push(sputnik);
    await this.groupRepository.save(group);

    return group;
  }

  async detachSputnik(groupId: number, sputnikUuid: string) {
    return this.dataSource.manager.transaction(async (manager) => {
      const userRepository = manager.getRepository(User);
      const groupRepository = manager.getRepository(Group);
      const sputnik = await userRepository.findOneOrFail({
        where: {
          role: UserRole.SPUTNIK,
          uuid: sputnikUuid,
        },
      });
      const group = await groupRepository.findOne({
        where: { id: groupId },
        relations: ['sputniks'],
      });

      group.sputniks = group.sputniks.filter(
        (sputnik) => sputnik.uuid !== sputnikUuid,
      );
      return this.groupRepository.save(group);
    });
  }
}
