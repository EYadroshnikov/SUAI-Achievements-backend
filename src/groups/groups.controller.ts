import { Body, Controller, Post } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dtos/create-group.dto';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  async create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupsService.create(createGroupDto);
  }
}
