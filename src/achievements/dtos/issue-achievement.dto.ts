import { ApiProperty } from '@nestjs/swagger';

export class IssueAchievementDto {
  @ApiProperty()
  studentUuid: string;

  @ApiProperty()
  achievementUuid: string;
}
