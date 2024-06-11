import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from '../users.service';
import { StudentDto } from '../dtos/student.dto';
import { CreateStudentDto } from '../dtos/create.student.dto';
import { UpdateResult } from 'typeorm';
import { RolesGuard } from '../../auth/roles.guard';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { Roles } from '../../auth/roles.decorator';
import { UserRole } from '../enums/user-role.enum';
import { TransformInterceptor } from '../../common/interceptors/transform.interceptor';
import { AuthorizedRequestDto } from '../../common/dtos/authorized.request.dto';
import { GroupDto } from '../../groups/dtos/group.dto';
import { GroupsService } from '../../groups/groups.service';

@ApiTags('Students')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class StudentsController {
  constructor(
    private readonly usersService: UsersService,
    private readonly groupService: GroupsService,
  ) {}

  @Post('/students')
  @ApiOperation({ summary: 'can access: sputnik, curator' })
  @Roles(UserRole.SPUTNIK, UserRole.CURATOR, UserRole.ADMIN)
  @ApiCreatedResponse({ type: StudentDto })
  @UseInterceptors(new TransformInterceptor(StudentDto))
  async createStudent(@Body() studentDto: CreateStudentDto) {
    return this.usersService.createStudent(studentDto);
  }

  @Patch('students/:uuid/ban')
  @ApiOperation({ summary: 'can access: sputnik, curator' })
  @Roles(UserRole.SPUTNIK, UserRole.CURATOR, UserRole.ADMIN)
  @ApiOkResponse({ type: UpdateResult })
  async banStudent(@Param('uuid') uuid: string) {
    return this.usersService.banStudent(uuid);
  }

  @Patch('students/:uuid/unban')
  @ApiOperation({ summary: 'can access: sputnik, curator' })
  @Roles(UserRole.SPUTNIK, UserRole.CURATOR, UserRole.ADMIN)
  @ApiOkResponse({ type: UpdateResult })
  async unbanStudent(@Param('uuid') uuid: string) {
    return this.usersService.unbanStudent(uuid);
  }

  @Get('/groups/:id/students')
  @ApiOperation({ summary: 'can access: sputnik, curator' })
  @Roles(UserRole.SPUTNIK, UserRole.CURATOR, UserRole.ADMIN)
  @ApiOkResponse({ type: StudentDto, isArray: true })
  @UseInterceptors(new TransformInterceptor(StudentDto))
  async getStudentsByGroup(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getStudentsByGroup(id);
  }

  @Get('/institutes/:id/students')
  @ApiOperation({ summary: 'can access: sputnik, curator' })
  @Roles(UserRole.SPUTNIK, UserRole.CURATOR, UserRole.ADMIN)
  @ApiOkResponse({ type: StudentDto, isArray: true })
  @UseInterceptors(new TransformInterceptor(StudentDto))
  async getStudentsByInstitute(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getStudentsByInstitute(id);
  }

  @Get('/students/me')
  @ApiOperation({ summary: 'can access: student' })
  @Roles(UserRole.STUDENT)
  @ApiOkResponse({ type: StudentDto })
  @UseInterceptors(new TransformInterceptor(StudentDto))
  async getMe(@Req() req: AuthorizedRequestDto) {
    return this.usersService.getStudent(req.user.uuid);
  }

  @Get('/students/me/groups/students')
  @ApiOperation({ summary: 'can access: student' })
  @Roles(UserRole.STUDENT)
  @ApiOkResponse({ type: StudentDto, isArray: true })
  @UseInterceptors(new TransformInterceptor(StudentDto))
  async getMyGroupsStudents(@Req() req: AuthorizedRequestDto) {
    const student = await this.usersService.getStudent(req.user.uuid);
    return this.usersService.getStudentsByGroup(student.group.id);
  }
}
