import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { UserDto } from './user.dto';
import { InstituteDto } from '../../institues/dtos/institute.dto';
import { GroupDto } from '../../groups/dtos/group.dto';

@Exclude()
export class SputnikDto extends UserDto {
  @ApiProperty({ type: InstituteDto })
  @Type(() => InstituteDto)
  @Expose()
  institute?: InstituteDto;

  @ApiProperty({ isArray: true, type: GroupDto })
  @Type(() => GroupDto)
  @Expose()
  sputnikGroups?: GroupDto[];
}
