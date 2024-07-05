import { IsInt, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddSputnikDto {
  @ApiProperty()
  @IsUUID()
  sputnikUuid: string;

  @ApiProperty()
  @IsInt()
  groupId: number;
}
