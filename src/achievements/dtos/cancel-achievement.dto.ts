import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class CancelAchievementDto {
  @ApiProperty()
  @IsUUID()
  studentUuid: string;

  @ApiProperty()
  @IsUUID()
  achievementUuid: string;

  @ApiProperty()
  @IsString()
  cancellationReason: string;
}
