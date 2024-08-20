import { UserDto } from './user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { GroupDto } from '../../groups/dtos/group.dto';

@Exclude()
export class StudentDto extends UserDto {
  @ApiProperty()
  @Expose()
  tgUserName: string;

  @ApiProperty()
  @Type(() => GroupDto)
  @Expose()
  group: GroupDto;

  @ApiProperty()
  @Expose()
  balance: number;
}
