import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { UserDto } from './user.dto';

@Exclude()
export class CuratorDto extends UserDto {
  @ApiProperty()
  @Expose()
  instituteId: number;
}
