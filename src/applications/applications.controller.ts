import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { RequestDto } from './dtos/request.dto';
import { AuthorizedRequestDto } from '../common/dtos/authorized.request.dto';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { ApplicationDto } from './dtos/application.dto';
import { ReviewDto } from './dtos/review.dto';
import { ApplicationStatus } from './enums/application-status.enum';
import { createReadStream, existsSync } from 'fs';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@ApiTags('Applications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post('students/applications')
  @ApiOperation({ summary: 'Can access: student' })
  @ApiOkResponse({ type: ApplicationDto })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'files', maxCount: 10 }], {
      limits: {
        fileSize: 67108864,
      },
      fileFilter: (req, file, callback) => {
        if (
          file.mimetype.startsWith('image/') ||
          file.mimetype.startsWith('video/')
        ) {
          callback(null, true);
        } else {
          callback(
            new BadRequestException('Only image and video files are allowed!'),
            false,
          );
        }
      },
    }),
  )
  @UseInterceptors(new TransformInterceptor(ApplicationDto))
  @Roles(UserRole.STUDENT)
  async createApplication(
    @Req() req: AuthorizedRequestDto,
    @Body() requestDto: RequestDto,
    @UploadedFiles()
    files: { files?: Express.Multer.File[] },
  ) {
    return await this.applicationsService.createApplication(
      req.user,
      requestDto,
      files?.files || [],
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

  @Delete('students/applications/:uuid')
  @ApiOperation({ summary: 'Can access: student' })
  @Roles(UserRole.STUDENT)
  async cancelApplication(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Req() req: AuthorizedRequestDto,
  ) {
    return this.applicationsService.cancelApplication(uuid, req.user);
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

  @Get('applications/proof-files/:uuid')
  @ApiOperation({ summary: 'Can access: all' })
  @Roles(UserRole.STUDENT, UserRole.SPUTNIK, UserRole.CURATOR, UserRole.ADMIN)
  async getProofFile(@Param('uuid') uuid: string, @Res() res: Response) {
    const filePath = await this.applicationsService.getFilePath(uuid);
    if (!existsSync(filePath)) {
      console.warn(`File not found`);
      throw new NotFoundException(`File not found`);
    }
    const stream = createReadStream(filePath);
    stream.pipe(res);
  }

  @Patch('applications/:uuid/approve')
  @ApiOperation({ summary: 'Can access: sputnik, curator' })
  @Roles(UserRole.SPUTNIK, UserRole.CURATOR, UserRole.ADMIN)
  @ApiOkResponse({ type: ApplicationDto, isArray: true })
  @UseInterceptors(new TransformInterceptor(ApplicationDto))
  async approve(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() reviewDto: ReviewDto,
    @Req() req: AuthorizedRequestDto,
  ) {
    return this.applicationsService.approveApplication(
      uuid,
      reviewDto,
      req.user,
    );
  }

  @Patch('applications/:uuid/reject')
  @ApiOperation({ summary: 'Can access: sputnik, curator' })
  @Roles(UserRole.SPUTNIK, UserRole.CURATOR, UserRole.ADMIN)
  @ApiOkResponse({ type: ApplicationDto, isArray: true })
  @UseInterceptors(new TransformInterceptor(ApplicationDto))
  async reject(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() reviewDto: ReviewDto,
    @Req() req: AuthorizedRequestDto,
  ) {
    return this.applicationsService.rejectApplication(
      uuid,
      reviewDto,
      req.user,
    );
  }

  @Get('reviewer/applications/pending')
  @ApiOperation({ summary: 'Can access: sputnik, curator' })
  @Roles(UserRole.SPUTNIK, UserRole.CURATOR)
  @ApiOkResponse({ type: ApplicationDto, isArray: true })
  @UseInterceptors(new TransformInterceptor(ApplicationDto))
  async getPendingApplications(@Req() req: AuthorizedRequestDto) {
    return this.applicationsService.getApplicationsForUser(
      req.user,
      ApplicationStatus.PENDING,
    );
  }

  @Get('reviewer/applications/all')
  @ApiOperation({ summary: 'Can access: sputnik, curator' })
  @Roles(UserRole.SPUTNIK, UserRole.CURATOR)
  @ApiOkResponse({ type: ApplicationDto, isArray: true })
  @UseInterceptors(new TransformInterceptor(ApplicationDto))
  async getAllApplications(@Req() req: AuthorizedRequestDto) {
    return this.applicationsService.getApplicationsForUser(req.user);
  }
}
