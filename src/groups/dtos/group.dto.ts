import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { SpecialityDto } from '../../specialties/dtos/speciality.dto';

@Exclude()
export class GroupDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  @Type(() => SpecialityDto)
  speciality: SpecialityDto;
}
