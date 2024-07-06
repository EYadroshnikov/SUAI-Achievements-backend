import { GroupDto } from './group.dto';
import { Exclude, Expose, Type } from 'class-transformer';
import { SputnikDto } from '../../users/dtos/sputnik.dto';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class GroupSputniksDto extends GroupDto {
  @ApiProperty()
  @Type(() => SputnikDto)
  @Expose()
  sputniks: SputnikDto[];

  @ApiProperty()
  @Expose()
  studentsCount: number;
}
