import {
  Body,
  Controller,
  Get,
  Patch,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserSettingsService } from './user-settings.service';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import { AuthorizedRequestDto } from '../common/dtos/authorized.request.dto';
import { UpdateUserSettingsDto } from './dtos/update-user-settings.dto';
import { UserSettingsDto } from './dtos/user-settings.dto';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { UpdateResult } from 'typeorm';

@ApiTags('User settings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class UserSettingsController {
  constructor(private readonly userSettingsService: UserSettingsService) {}

  @Get('me/user-settings')
  @ApiOperation({ summary: 'can access: student' })
  @Roles(UserRole.STUDENT)
  @ApiOkResponse({ type: UserSettingsDto })
  @UseInterceptors(new TransformInterceptor(UserSettingsDto))
  async get(@Req() req: AuthorizedRequestDto) {
    return this.userSettingsService.get(req.user);
  }

  @Patch('me/user-settings')
  @ApiOperation({ summary: 'can access: student' })
  @Roles(UserRole.STUDENT)
  @ApiOkResponse({ type: UpdateResult })
  async update(
    @Req() req: AuthorizedRequestDto,
    @Body() updateUserSettingsDto: UpdateUserSettingsDto,
  ) {
    return this.userSettingsService.update(req.user, updateUserSettingsDto);
  }
}
