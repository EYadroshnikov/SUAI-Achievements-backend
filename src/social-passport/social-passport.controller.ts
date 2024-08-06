import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
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

@ApiTags('Social Passport')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class SocialPassportController {
  constructor(private readonly socialPassportService: SocialPassportService) {}

  @Get('me/social-password')
  @ApiOperation({ summary: 'can access: student' })
  @Roles(UserRole.STUDENT)
  @ApiOkResponse({ type: SocialPassportDto })
  @UseInterceptors(new TransformInterceptor(SocialPassportDto))
  async getMySocialPassport(@Req() req: AuthorizedRequestDto) {
    return this.socialPassportService.findOne(req.user.uuid);
  }

  @Get('students/:uuid/social-password')
  @ApiOperation({ summary: 'can access: sputnik, curator' })
  @Roles(UserRole.SPUTNIK, UserRole.CURATOR, UserRole.ADMIN)
  @ApiOkResponse({ type: SocialPassportDto })
  @UseInterceptors(new TransformInterceptor(SocialPassportDto))
  async getSocialPassport(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.socialPassportService.findOne(uuid);
  }

  @Post('me/social-password')
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

  @Post('students/:uuid/group-role')
  @ApiOperation({ summary: 'can access: sputnik, curator' })
  @Roles(UserRole.SPUTNIK, UserRole.CURATOR, UserRole.ADMIN)
  @ApiQuery({ name: 'role', enum: GroupRole, required: true })
  @ApiOkResponse({ type: SocialPassportDto })
  @UseInterceptors(new TransformInterceptor(SocialPassportDto))
  async setGroupRole(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Query('role', new ParseGroupRolePipe()) role: GroupRole,
  ) {
    return this.socialPassportService.setGroupRole(uuid, role);
  }
}
