import { Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dtos/create-group.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './entities/group.entity';
import { Institute } from '../institues/entities/institute.entity';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(Institute)
    private instituteRepository: Repository<Institute>,
  ) {}

  async create(createGroupDto: CreateGroupDto): Promise<Group> {
    const institute = await this.instituteRepository.findOne({
      where: { id: createGroupDto.institute_id },
    });

    const group = new Group();
    group.name = createGroupDto.name;
    group.institute = institute;

    return this.groupRepository.save(group);
  }
}
