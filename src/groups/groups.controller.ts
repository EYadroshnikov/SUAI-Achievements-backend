import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dtos/create-group.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { GroupDto } from './dtos/group.dto';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';

@ApiTags('Groups')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post('/groups')
  @ApiOperation({ summary: 'can access: sputnik, curator' })
  @Roles(UserRole.SPUTNIK, UserRole.CURATOR, UserRole.ADMIN)
  @UseInterceptors(new TransformInterceptor(GroupDto))
  @ApiCreatedResponse({ type: GroupDto })
  async create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupsService.create(createGroupDto);
  }

  @Get('/institutes/:id/groups')
  @ApiOperation({ summary: 'can access: sputnik, curator' })
  @Roles(UserRole.SPUTNIK, UserRole.CURATOR, UserRole.ADMIN)
  @UseInterceptors(new TransformInterceptor(GroupDto))
  @ApiOkResponse({ type: GroupDto, isArray: true })
  async getGroupsByInstitute(@Param('id', ParseIntPipe) id: number) {
    return this.groupsService.getGroupsByInstitute(id); //TODO: add pagination
  }
}
