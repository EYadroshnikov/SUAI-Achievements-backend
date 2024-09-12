import { ApiProperty } from '@nestjs/swagger';

export class RequestDto {
  @ApiProperty()
  achievementUuid: string;
}
