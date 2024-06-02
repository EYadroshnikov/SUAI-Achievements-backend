import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dtos/create-group.dto';
import { ApiTags } from '@nestjs/swagger';
import { TransformInterceptor } from '../interceptors/transform.interceptor';
import { GroupDto } from './dtos/group.dto';
import { TransformCreatedApiResponse } from '../decorators/transform-created-api-response.decorator';

@ApiTags('Groups')
@Controller()
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post('/groups')
  @TransformCreatedApiResponse(GroupDto)
  async create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupsService.create(createGroupDto);
  }

  @Get('/institutes/:id/groups')
  @UseInterceptors(new TransformInterceptor(GroupDto))
  async getGroupsByInstitute(@Param('id', ParseIntPipe) id: number) {
    return this.groupsService.getGroupsByInstitute(id);
  }
}
