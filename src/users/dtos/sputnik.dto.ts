import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { UserDto } from './user.dto';
import { Group } from '../../groups/entities/group.entity';
import { InstituteDto } from '../../institues/dtos/institute.dto';

@Exclude()
export class SputnikDto extends UserDto {
  @ApiProperty()
  @Expose()
  institute?: InstituteDto;

  @ApiProperty({ isArray: true })
  @Expose()
  sputnikGroups?: Group[];
}
