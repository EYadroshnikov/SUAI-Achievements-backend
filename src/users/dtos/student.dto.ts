import { UserDto } from './user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { GroupDto } from '../../groups/dtos/group.dto';
import { InstituteDto } from '../../institues/dtos/institute.dto';

@Exclude()
export class StudentDto extends UserDto {
  @ApiProperty()
  @Expose()
  institute: InstituteDto;

  @ApiProperty()
  @Expose()
  group: GroupDto;

  @ApiProperty()
  @Expose()
  balance: number;
}
