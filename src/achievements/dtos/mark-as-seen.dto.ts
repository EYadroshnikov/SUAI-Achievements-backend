import { IsArray, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MarkAsSeenDto {
  @ApiProperty({ isArray: true })
  @IsArray()
  @IsUUID('all', { each: true })
  issuedAchievementUuids: string[];
}
