import { Controller } from '@nestjs/common';
import { AchievementsService } from './achievements.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Achievements')
@Controller('achievements')
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}
}
