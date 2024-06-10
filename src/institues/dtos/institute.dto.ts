import { ApiProperty } from '@nestjs/swagger';

export class InstituteDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  shortName: string;

  @ApiProperty()
  number: number;
}
