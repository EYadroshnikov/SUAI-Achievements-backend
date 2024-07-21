import { GroupDto } from './group.dto';
import { Exclude, Expose, Type } from 'class-transformer';
import { SputnikDto } from '../../users/dtos/sputnik.dto';
import { ApiProperty } from '@nestjs/swagger';
import { SpecialityDto } from '../../specialties/dtos/speciality.dto';

@Exclude()
export class GroupSputniksDto extends GroupDto {
  @ApiProperty({ type: SputnikDto, isArray: true })
  @Type(() => SputnikDto)
  @Expose()
  sputniks: SputnikDto[];

  @ApiProperty()
  @Type(() => SpecialityDto)
  @Expose()
  speciality: SpecialityDto;

  @ApiProperty()
  @Expose()
  studentsCount: number;
}
