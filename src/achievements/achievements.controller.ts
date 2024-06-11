import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AchievementsService } from './achievements.service';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthorizedRequestDto } from '../common/dtos/authorized.request.dto';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import { AchievementDto } from './dtos/achievement.dto';
import { UsersService } from '../users/users.service';
import { IssueAchievementDto } from './dtos/issue-achievement.dto';

@ApiTags('Achievements')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('achievements')
export class AchievementsController {
  constructor(
    private readonly achievementsService: AchievementsService,
    private readonly userService: UsersService,
  ) {}

  @Get()
  @Roles(UserRole.STUDENT, UserRole.SPUTNIK, UserRole.CURATOR, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get achievements for the authenticated user' })
  @ApiOkResponse({ type: AchievementDto, isArray: true })
  async getAchievements(
    @Req() req: AuthorizedRequestDto,
  ): Promise<AchievementDto[]> {
    const user = req.user;
    return this.achievementsService.getAchievementsForUser(user);
  }

  @Get('/:uuid')
  @Roles(UserRole.SPUTNIK, UserRole.CURATOR, UserRole.ADMIN)
  @ApiOperation({
    summary:
      'Get achievements for the authenticated user\nCan access: sputnik, curator',
  })
  @ApiOkResponse({ type: AchievementDto, isArray: true })
  async getAchievementForUser(
    @Param('uuid') uuid: string,
  ): Promise<AchievementDto[]> {
    const user = await this.userService.getStudent(uuid);
    return this.achievementsService.getAchievementsForUser(user);
  }

  @Post('/issue')
  @Roles(UserRole.SPUTNIK, UserRole.CURATOR, UserRole.ADMIN)
  @ApiOperation({
    summary: 'Can access: sputnik, curator',
  })
  @ApiCreatedResponse() //TODO: add type
  async issueAchievement(
    @Req() req: AuthorizedRequestDto,
    @Body() issueAchievementsDto: IssueAchievementDto,
  ) {
    return this.achievementsService.issueAchievement(
      req.user,
      issueAchievementsDto,
    );
  }
}
