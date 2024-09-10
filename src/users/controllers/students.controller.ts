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
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
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
import {
  ApiOkPaginatedResponse,
  ApiPaginationQuery,
  Paginate,
} from 'nestjs-paginate';
import { PaginateDto } from '../dtos/paginate.dto';
import { UpdateStudentDto } from '../dtos/update.student.dto';
import { RankDto } from '../dtos/rank.dto';
import { PaginatedTransformInterceptor } from '../../common/interceptors/paginated-transform.interceptor';
import { AllRanksDto } from '../dtos/all-ranks.dto';
import { TopStudentDto } from '../dtos/top-student.dto';
import { StudentWithSettingsDto } from '../dtos/student-with-settings.dto';

@ApiTags('Students')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class StudentsController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/students')
  @ApiOperation({ summary: 'can access: sputnik, curator' })
  @Roles(UserRole.SPUTNIK, UserRole.CURATOR, UserRole.ADMIN)
  @ApiCreatedResponse({ type: StudentDto })
  @UseInterceptors(new TransformInterceptor(StudentDto))
  async createStudent(@Body() studentDto: CreateStudentDto) {
    return this.usersService.createStudent(studentDto);
  }

  @Patch('/students/:uuid')
  @ApiOperation({ summary: 'can access: sputnik, curator' })
  @Roles(UserRole.SPUTNIK, UserRole.CURATOR, UserRole.ADMIN)
  @ApiOkResponse({ type: UpdateResult })
  async updateStudent(
    @Req() req: AuthorizedRequestDto,
    @Param('uuid') uuid: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    return this.usersService.updateStudent(uuid, updateStudentDto, req.user);
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

  @Delete('/students/:uuid')
  @ApiOperation({ summary: 'can access: sputnik, curator' })
  @Roles(UserRole.SPUTNIK, UserRole.CURATOR, UserRole.ADMIN)
  async deleteStudent(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.usersService.deleteStudent(uuid);
  }

  @Get('/groups/:id/students')
  @ApiOperation({ summary: 'can access: sputnik, curator' })
  @Roles(UserRole.SPUTNIK, UserRole.CURATOR, UserRole.ADMIN)
  @ApiOkResponse({ type: StudentDto, isArray: true })
  @UseInterceptors(new TransformInterceptor(StudentDto))
  async getStudentsByGroup(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthorizedRequestDto, //TODO: check if the group belongs to the user
  ) {
    return this.usersService.getStudentsByGroup(id);
  }

  @Get('/institutes/:id/students')
  @ApiOperation({ summary: 'can access: curator' })
  @Roles(UserRole.CURATOR, UserRole.ADMIN)
  @ApiPaginationQuery({ sortableColumns: ['balance'] })
  @ApiOkPaginatedResponse(StudentDto, { sortableColumns: ['balance'] })
  @UseInterceptors(new PaginatedTransformInterceptor(StudentDto))
  async getStudentsByInstitute(
    @Param('id', ParseIntPipe) id: number,
    @Paginate() paginateDto: PaginateDto,
  ) {
    return this.usersService.getStudentsByInstitute(id, paginateDto);
  }

  @Get('/students/me')
  @ApiOperation({ summary: 'can access: student' })
  @Roles(UserRole.STUDENT)
  @ApiOkResponse({ type: StudentWithSettingsDto })
  @UseInterceptors(new TransformInterceptor(StudentWithSettingsDto))
  async getMe(@Req() req: AuthorizedRequestDto) {
    return this.usersService.getStudentMe(req.user.uuid);
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

  @Get('/students/top')
  @ApiOperation({ summary: 'can access: all' })
  @Roles(UserRole.STUDENT, UserRole.SPUTNIK, UserRole.CURATOR, UserRole.ADMIN)
  @ApiPaginationQuery({ sortableColumns: ['balance'] })
  @ApiOkPaginatedResponse(TopStudentDto, { sortableColumns: ['balance'] })
  @UseInterceptors(new PaginatedTransformInterceptor(TopStudentDto))
  async getTopStudents(
    @Req() req: AuthorizedRequestDto,
    @Paginate() query: PaginateDto,
  ) {
    return this.usersService.getTopStudents(req.user, query);
  }

  @Get('/groups/:id/students/top')
  @ApiOperation({ summary: 'can access: all' })
  @Roles(UserRole.STUDENT, UserRole.SPUTNIK, UserRole.CURATOR, UserRole.ADMIN)
  @ApiOkResponse({ type: StudentDto, isArray: true })
  @UseInterceptors(new TransformInterceptor(StudentDto))
  async getGroupsTopById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getStudentsTopGroup(id);
  }

  @Get('/institutes/:id/students/top')
  @ApiOperation({ summary: 'can access: all' })
  @Roles(UserRole.STUDENT, UserRole.SPUTNIK, UserRole.CURATOR, UserRole.ADMIN)
  @ApiPaginationQuery({ sortableColumns: ['balance'] })
  @ApiOkPaginatedResponse(TopStudentDto, { sortableColumns: ['balance'] })
  @UseInterceptors(new PaginatedTransformInterceptor(TopStudentDto))
  async getInstitutesTopById(
    @Param('id', ParseIntPipe) id: number,
    @Paginate() paginateDto: PaginateDto,
    @Req() req: AuthorizedRequestDto,
  ) {
    return this.usersService.getTopStudents(req.user, {
      ...paginateDto,
      filter: { 'institute.id': '$eq:' + id },
    });
  }

  @Get('/students/top/me/groups')
  @ApiOperation({ summary: 'can access: student' })
  @Roles(UserRole.STUDENT)
  @ApiOkResponse({ type: TopStudentDto, isArray: true })
  @UseInterceptors(new TransformInterceptor(TopStudentDto))
  async getTopMyGroupsStudents(@Req() req: AuthorizedRequestDto) {
    return this.usersService.getStudentsTopMyGroup(req.user);
  }

  @Get('/students/top/me/institutes')
  @ApiOperation({ summary: 'can access: student' })
  @Roles(UserRole.STUDENT)
  @ApiPaginationQuery({ sortableColumns: ['balance'] })
  @ApiOkPaginatedResponse(TopStudentDto, { sortableColumns: ['balance'] })
  @UseInterceptors(new PaginatedTransformInterceptor(TopStudentDto))
  async getTopMyInstituteStudents(
    @Req() req: AuthorizedRequestDto,
    @Paginate() paginateDto: PaginateDto,
  ) {
    const student = await this.usersService.getStudent(req.user.uuid);
    return this.usersService.getTopStudents(req.user, {
      ...paginateDto,
      filter: { 'institute.id': '$eq:' + student.institute.id },
    });
  }

  @Get('/students/me/groups/rank')
  @ApiOperation({ summary: 'can access: student' })
  @Roles(UserRole.STUDENT)
  @ApiOkResponse({ type: RankDto })
  @UseInterceptors(new TransformInterceptor(RankDto))
  async getMyGroupRank(@Req() req: AuthorizedRequestDto) {
    return this.usersService.getRank(req.user.uuid, 'group');
  }

  @Get('/students/me/institutes/rank')
  @ApiOperation({ summary: 'can access: student' })
  @Roles(UserRole.STUDENT)
  @ApiOkResponse({ type: RankDto })
  @UseInterceptors(new TransformInterceptor(RankDto))
  async getMyInstituteRank(@Req() req: AuthorizedRequestDto) {
    return this.usersService.getRank(req.user.uuid, 'institute');
  }

  @Get('/students/me/rank')
  @ApiOperation({ summary: 'can access: student' })
  @Roles(UserRole.STUDENT)
  @ApiOkResponse({ type: RankDto })
  @UseInterceptors(new TransformInterceptor(RankDto))
  async getMyRank(@Req() req: AuthorizedRequestDto) {
    return this.usersService.getRank(req.user.uuid, 'university');
  }

  @Get('/students/me/rank/all')
  @ApiOperation({ summary: 'can access: student' })
  @Roles(UserRole.STUDENT)
  @ApiOkResponse({ type: AllRanksDto })
  @UseInterceptors(new TransformInterceptor(AllRanksDto))
  async getAllMyRanks(@Req() req: AuthorizedRequestDto) {
    return this.usersService.getAllRanks(req.user.uuid);
  }

  @Get('/students/:uuid/rank/all')
  @ApiOperation({ summary: 'can access: sputnik, curator, admin' })
  @Roles(UserRole.SPUTNIK, UserRole.CURATOR, UserRole.ADMIN)
  @ApiOkResponse({ type: AllRanksDto })
  @UseInterceptors(new TransformInterceptor(AllRanksDto))
  async getAllStudentRank(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.usersService.getAllRanks(uuid);
  }
}
