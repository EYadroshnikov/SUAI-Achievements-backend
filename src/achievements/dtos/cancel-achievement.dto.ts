import { ApiProperty } from '@nestjs/swagger';

export class CancelAchievementDto {
  @ApiProperty()
  studentUuid: string;

  @ApiProperty()
  achievementUuid: string;

  @ApiProperty()
  cancellationReason: string;
}
