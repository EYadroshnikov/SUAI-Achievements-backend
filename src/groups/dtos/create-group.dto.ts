import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateGroupDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  instituteId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  specialityId: number;
}
