import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dtos/create-group.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Group } from './entities/group.entity';
import { Institute } from '../institues/entities/institute.entity';
import { InstitutesService } from '../institues/institutes.service';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    private instituteService: InstitutesService,
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
      throw new BadRequestException('Группы не в институте ил ты даун');
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

  // async getStudentsByInstitute(id: number) {
  //   await this.instituteService.findOne(id);
  //   return this.userRepository.find({
  //     where: { institute: { id }, role: UserRole.STUDENT },
  //   });
  // }
}
