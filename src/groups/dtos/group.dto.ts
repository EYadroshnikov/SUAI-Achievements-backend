import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class GroupDto {
  @ApiProperty()
  @Expose()
  name: string;
}
