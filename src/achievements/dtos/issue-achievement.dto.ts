import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class IssueAchievementDto {
  @ApiProperty()
  @IsUUID()
  studentUuid: string;

  @ApiProperty()
  @IsUUID()
  achievementUuid: string;
}
