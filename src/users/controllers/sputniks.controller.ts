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
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SputnikDto } from '../dtos/sputnik.dto';
import { CreateSputnikDto } from '../dtos/create.sputnik.dto';
import { UsersService } from '../users.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { UserRole } from '../enums/user-role.enum';
import { TransformInterceptor } from '../../common/interceptors/transform.interceptor';
import { AuthorizedRequestDto } from '../../common/dtos/authorized.request.dto';
import { StudentDto } from '../dtos/student.dto';
import {
  ApiOkPaginatedResponse,
  ApiPaginationQuery,
  Paginate,
  Paginated,
} from 'nestjs-paginate';
import { PaginateDto } from '../dtos/paginate.dto';

@ApiTags('Sputniks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class SputniksController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/sputniks')
  @ApiOperation({ summary: 'can access: curator' })
  @Roles(UserRole.CURATOR, UserRole.ADMIN)
  @ApiCreatedResponse({ type: SputnikDto })
  @UseInterceptors(new TransformInterceptor(SputnikDto))
  async createSputnik(
    @Body() sputnikDto: CreateSputnikDto,
  ): Promise<SputnikDto> {
    return this.usersService.createSputnik(sputnikDto);
  }

  @Get('/groups/:id/sputniks')
  @ApiOperation({ summary: 'can access: curator' })
  @Roles(UserRole.CURATOR, UserRole.ADMIN)
  @ApiOkResponse({ type: SputnikDto, isArray: true })
  @UseInterceptors(new TransformInterceptor(SputnikDto))
  async getSputniksByGroup(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getSputniksByGroup(id);
  }

  @Get('/institutes/:id/sputniks')
  @ApiOperation({ summary: 'can access: curator' })
  @Roles(UserRole.CURATOR, UserRole.ADMIN)
  @ApiOkResponse({ type: SputnikDto, isArray: true })
  @UseInterceptors(new TransformInterceptor(SputnikDto))
  async getSputniksByInstitute(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getSputniksByInstitute(id);
  }

  @Get('/sputniks/me')
  @ApiOperation({ summary: 'can access: sputnik' })
  @Roles(UserRole.SPUTNIK)
  @ApiOkResponse({ type: SputnikDto })
  @UseInterceptors(new TransformInterceptor(SputnikDto))
  async getMe(@Req() req: AuthorizedRequestDto) {
    return this.usersService.getSputnik(req.user.uuid);
  }

  @Get('/sputniks/me/groups/:id/students')
  @ApiOperation({ summary: 'can access: sputnik' })
  @Roles(UserRole.SPUTNIK)
  @ApiOkResponse({ type: StudentDto, isArray: true })
  @UseInterceptors(new TransformInterceptor(StudentDto))
  async getMySputnikGroupsStudents(
    @Req() req: AuthorizedRequestDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const sputnik = await this.usersService.getSputnik(req.user.uuid);
    if (!sputnik.sputnikGroups.some((group) => group.id === id)) {
      throw new NotFoundException('Group not found');
    }
    return this.usersService.getStudentsByGroup(id);
  }

  @Get('/sputniks/top/me/groups/:id/')
  @ApiOperation({ summary: 'can access: sputnik' })
  @Roles(UserRole.SPUTNIK)
  @ApiOkResponse({ type: StudentDto, isArray: true })
  @UseInterceptors(new TransformInterceptor(StudentDto))
  async getMySputnikGroupsStudentsTop(
    @Req() req: AuthorizedRequestDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const sputnik = await this.usersService.getSputnik(req.user.uuid);
    if (!sputnik.sputnikGroups.some((group) => group.id === id)) {
      throw new NotFoundException('Group not found');
    }
    return this.usersService.getStudentsTopGroup(id);
  }

  @Get('/sputniks/top/me/institutes')
  @ApiOperation({ summary: 'can access: sputnik' })
  @Roles(UserRole.SPUTNIK)
  @ApiPaginationQuery({ sortableColumns: ['balance'] })
  @ApiOkPaginatedResponse(SputnikDto, { sortableColumns: ['balance'] })
  @UseInterceptors(new TransformInterceptor(Paginated<SputnikDto>))
  async getMySputnikInstituteStudentsTop(
    @Req() req: AuthorizedRequestDto,
    @Paginate() paginateDto: PaginateDto,
  ) {
    const sputnik = await this.usersService.getSputnik(req.user.uuid);
    return this.usersService.getTopStudents({
      ...paginateDto,
      filter: { 'institute.id': '$eq:' + sputnik.institute.id },
    });
  }
}
