import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { UserDto } from './user.dto';

@Exclude()
export class SputnikDto extends UserDto {
  // TODO: Frontend sync
  @ApiProperty()
  @Expose()
  instituteId?: number;

  @ApiProperty({ isArray: true })
  @Expose()
  groupIds?: number[];
}
