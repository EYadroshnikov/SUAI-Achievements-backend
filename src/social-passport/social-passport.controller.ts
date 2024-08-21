import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SocialPassportService } from './social-passport.service';
import { AuthorizedRequestDto } from '../common/dtos/authorized.request.dto';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../users/enums/user-role.enum';
import { Roles } from '../auth/roles.decorator';
import { SocialPassportDto } from './dtos/social-passport.dto';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { CreateSocialPassportDto } from './dtos/create-social-passport.dto';
import { ParseGroupRolePipe } from '../common/validation-pipes/parse-group-role.pipe';
import { GroupRole } from './enums/group-role.enum';
import { UpdateResult } from 'typeorm';
import { UpdateSocialPassportDto } from './dtos/update-social-passport.dto';

@ApiTags('Social Passport')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class SocialPassportController {
  constructor(private readonly socialPassportService: SocialPassportService) {}

  @Get('students/me/social-passport')
  @ApiOperation({ summary: 'can access: student' })
  @Roles(UserRole.STUDENT)
  @ApiOkResponse({ type: SocialPassportDto })
  @UseInterceptors(new TransformInterceptor(SocialPassportDto))
  async getMySocialPassport(@Req() req: AuthorizedRequestDto) {
    return this.socialPassportService.findOne(req.user.uuid);
  }

  @Post('students/me/social-passport')
  @ApiOperation({ summary: 'can access: student' })
  @Roles(UserRole.STUDENT)
  @ApiOkResponse({ type: SocialPassportDto })
  @UseInterceptors(new TransformInterceptor(SocialPassportDto))
  async createMySocialPassport(
    @Req() req: AuthorizedRequestDto,
    @Body() createSocialPassportDto: CreateSocialPassportDto,
  ) {
    return this.socialPassportService.create(req.user, createSocialPassportDto);
  }

  @Patch('students/me/social-passport')
  @ApiOperation({ summary: 'can access: student' })
  @Roles(UserRole.STUDENT)
  async updateMySocialPassport(
    @Req() req: AuthorizedRequestDto,
    @Body() updateSocialPassportDto: UpdateSocialPassportDto,
  ) {
    return this.socialPassportService.update(req.user, updateSocialPassportDto);
  }

  @Get('students/:uuid/social-passport')
  @ApiOperation({ summary: 'can access: sputnik, curator' })
  @Roles(UserRole.SPUTNIK, UserRole.CURATOR, UserRole.ADMIN)
  @ApiOkResponse({ type: SocialPassportDto })
  @UseInterceptors(new TransformInterceptor(SocialPassportDto))
  async getSocialPassport(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.socialPassportService.findOne(uuid);
  }

  @Patch('students/:uuid/social-passport/group-role')
  @ApiOperation({ summary: 'can access: sputnik, curator' })
  @Roles(UserRole.SPUTNIK, UserRole.CURATOR, UserRole.ADMIN)
  @ApiQuery({ name: 'role', enum: GroupRole, required: true })
  @ApiOkResponse({ type: UpdateResult })
  async setGroupRole(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Query('role', new ParseGroupRolePipe()) role: GroupRole,
  ) {
    return this.socialPassportService.setGroupRole(uuid, role);
  }
}
