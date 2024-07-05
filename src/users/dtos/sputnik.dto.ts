import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { UserDto } from './user.dto';
import { InstituteDto } from '../../institues/dtos/institute.dto';
import { GroupDto } from '../../groups/dtos/group.dto';

@Exclude()
export class SputnikDto extends UserDto {
  @ApiProperty()
  @Expose()
  institute?: InstituteDto;

  @ApiProperty({ isArray: true, type: GroupDto })
  @Expose()
  sputnikGroups?: GroupDto[];
}
