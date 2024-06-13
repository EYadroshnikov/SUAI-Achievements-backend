import { IsNumber, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddSputnikDto {
  @ApiProperty()
  @IsUUID()
  sputnikUuid: string;

  @ApiProperty()
  @IsNumber()
  groupId: number;
}
