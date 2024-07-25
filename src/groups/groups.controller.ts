import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Req,
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
import { GroupSputniksDto } from './dtos/group-sputniks.dto';
import { AuthorizedRequestDto } from '../common/dtos/authorized.request.dto';
import { UsersService } from '../users/users.service';
import { AddSputnikDto } from './dtos/add-sputnik.dto';

@ApiTags('Groups')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class GroupsController {
  constructor(
    private readonly groupsService: GroupsService,
    private userService: UsersService,
  ) {}

  @Post('/groups')
  @ApiOperation({ summary: 'can access: sputnik, curator' })
  @Roles(UserRole.CURATOR, UserRole.ADMIN)
  @UseInterceptors(new TransformInterceptor(GroupDto))
  @ApiCreatedResponse({ type: GroupDto })
  async create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupsService.create(createGroupDto);
  }

  @Post('groups/add-sputnik')
  @ApiOperation({ summary: 'can access: curator' })
  @Roles(UserRole.CURATOR, UserRole.ADMIN)
  @UseInterceptors(new TransformInterceptor(GroupSputniksDto))
  @ApiOkResponse({ type: GroupSputniksDto })
  async addSputnikToGroup(
    @Body() addSputnikDto: AddSputnikDto,
    @Req() req: AuthorizedRequestDto,
  ) {
    const curator = await this.userService.getCurator(req.user.uuid);
    const sputnik = await this.userService.getSputnik(
      addSputnikDto.sputnikUuid,
    );
    if (
      req.user.role !== UserRole.ADMIN &&
      curator.institute.id !== sputnik.institute.id
    ) {
      throw new BadRequestException(
        `sputnik with uuid: ${sputnik.uuid} doesn't belong to your institute with id: ${curator.institute.id}`,
      );
    }
    return this.groupsService.addSputnik(addSputnikDto);
  }

  @Get('groups/me')
  @ApiOperation({ summary: 'can access: student' })
  @Roles(UserRole.STUDENT)
  @UseInterceptors(new TransformInterceptor(GroupSputniksDto))
  @ApiOkResponse({ type: GroupSputniksDto, isArray: true })
  async getMyGroup(@Req() req: AuthorizedRequestDto) {
    const student = await this.userService.getStudent(req.user.uuid);
    return this.groupsService.getGroup(student.group.id);
  }

  @Get('groups/:id')
  @ApiOperation({ summary: 'can access: sputnik, curator' })
  @Roles(UserRole.SPUTNIK, UserRole.CURATOR, UserRole.ADMIN)
  @UseInterceptors(new TransformInterceptor(GroupSputniksDto))
  @ApiOkResponse({ type: GroupSputniksDto })
  async getGroupById(@Param('id', ParseIntPipe) id: number) {
    return this.groupsService.getGroup(id);
  }

  @Get('/institutes/:id/groups')
  @ApiOperation({ summary: 'can access: sputnik, curator' })
  @Roles(UserRole.SPUTNIK, UserRole.CURATOR, UserRole.ADMIN)
  @UseInterceptors(new TransformInterceptor(GroupSputniksDto))
  @ApiOkResponse({ type: GroupSputniksDto, isArray: true })
  async getGroupsByInstitute(@Param('id', ParseIntPipe) id: number) {
    return this.groupsService.getGroupsByInstitute(id);
  }

  @Delete('groups/:groupId/sputniks/:userId/detach')
  async unbindSputnik(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Param('userUuid', ParseUUIDPipe) userUuid: string,
  ) {
    return this.groupsService.detachSputnik(groupId, userUuid);
  }
}
