import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { RequestDto } from './dtos/request.dto';
import { AuthorizedRequestDto } from '../common/dtos/authorized.request.dto';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { ApplicationDto } from './dtos/application.dto';
import { RejectDto } from './dtos/reject.dto';

@ApiTags('Applications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post('students/applications')
  @ApiOperation({ summary: 'Can access: student' })
  @ApiOkResponse({ type: ApplicationDto })
  @UseInterceptors(FileFieldsInterceptor([{ name: 'files', maxCount: 10 }]))
  @UseInterceptors(new TransformInterceptor(ApplicationDto))
  @Roles(UserRole.STUDENT)
  async createApplication(
    @Body() requestDto: RequestDto,
    @UploadedFiles() files,
    @Req() req: AuthorizedRequestDto,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('At least one file required');
    }
    console.log(files.files);
    return await this.applicationsService.createApplication(
      req.user,
      requestDto,
      files.files,
    );
  }

  @Get('students/me/applications')
  @ApiOperation({ summary: 'Can access: student' })
  @Roles(UserRole.STUDENT)
  @ApiOkResponse({ type: ApplicationDto, isArray: true })
  @UseInterceptors(new TransformInterceptor(ApplicationDto))
  async getMyApplications(@Req() req: AuthorizedRequestDto) {
    return this.applicationsService.getStudentsApplications(
      req.user.uuid,
      req.user,
    );
  }

  @Get('students/:uuid/applications')
  @ApiOperation({ summary: 'Can access: sputnik, curator' })
  @Roles(UserRole.SPUTNIK, UserRole.CURATOR, UserRole.ADMIN)
  @ApiOkResponse({ type: ApplicationDto, isArray: true })
  @UseInterceptors(new TransformInterceptor(ApplicationDto))
  async getStudentsApplications(
    @Param('uuid', ParseUUIDPipe) studentUuid: string,
    @Req() req: AuthorizedRequestDto,
  ) {
    return this.applicationsService.getStudentsApplications(
      studentUuid,
      req.user,
    );
  }

  @Patch('applications/:uuid/approve')
  @ApiOperation({ summary: 'Can access: sputnik, curator' })
  @Roles(UserRole.SPUTNIK, UserRole.CURATOR, UserRole.ADMIN)
  async approve(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Req() req: AuthorizedRequestDto,
  ) {
    return this.applicationsService.approveApplication(uuid, req.user);
  }

  @Patch('applications/:uuid/reject')
  @ApiOperation({ summary: 'Can access: sputnik, curator' })
  @Roles(UserRole.SPUTNIK, UserRole.CURATOR, UserRole.ADMIN)
  async reject(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() rejectDto: RejectDto,
    @Req() req: AuthorizedRequestDto,
  ) {
    return this.applicationsService.rejectApplication(
      uuid,
      rejectDto,
      req.user,
    );
  }

  @Get('applications/pending')
  @ApiOperation({ summary: 'Can access: sputnik' })
  @Roles(UserRole.SPUTNIK)
  @ApiOkResponse({ type: ApplicationDto, isArray: true })
  @UseInterceptors(new TransformInterceptor(ApplicationDto))
  async getPendingApplications(@Req() req: AuthorizedRequestDto) {
    return this.applicationsService.getPendingApplications(req.user);
  }
}
