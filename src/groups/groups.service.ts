import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dtos/create-group.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Group } from './entities/group.entity';
import { Institute } from '../institues/entities/institute.entity';
import { InstitutesService } from '../institues/institutes.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    private instituteService: InstitutesService,
    // private userService: UsersService,
  ) {}

  findOne(id: number) {
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

    const group = new Group();
    group.name = createGroupDto.name;
    group.institute = institute;

    return this.groupRepository.save(group);
  }

  async getGroupsByInstitute(id: number) {
    await this.instituteService.findOne(id);
    return this.groupRepository.find({
      where: { institute: { id } },
    });
  }

  async getGroup(id: number) {
    return this.groupRepository.findOneOrFail({
      where: { id },
      relations: ['sputniks'],
    });
  }

  //
  // async addSputnik(addSputnikDto: AddSputnikDto): Promise<Group> {
  //   const { sputnikUuid, groupId } = addSputnikDto;
  //
  //   const group = await this.groupRepository.findOneOrFail({
  //     where: { id: groupId },
  //     relations: ['sputniks'],
  //   });
  //
  //   const sputnik = await this.userService.getSputnik(sputnikUuid);
  //
  //   group.sputniks.push(sputnik);
  //   await this.groupRepository.save(group);
  //
  //   return group;
  // } TODO: Resolve circular dependency
}
