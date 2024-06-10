import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { UserDto } from './user.dto';
import { InstituteDto } from '../../institues/dtos/institute.dto';

@Exclude()
export class CuratorDto extends UserDto {
  @ApiProperty()
  @Expose()
  institute: InstituteDto;
}
