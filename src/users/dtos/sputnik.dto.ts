import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { UserDto } from './user.dto';
import { InstituteDto } from '../../institues/dtos/institute.dto';
import { GroupDto } from '../../groups/dtos/group.dto';
import { GroupStudentsCountDto } from '../../groups/dtos/group-students-count.dto';

@Exclude()
export class SputnikDto extends UserDto {
  @ApiProperty({ type: InstituteDto })
  @Expose()
  institute?: InstituteDto;

  @ApiProperty({ isArray: true, type: GroupStudentsCountDto })
  @Expose()
  sputnikGroups?: GroupStudentsCountDto[];
}
