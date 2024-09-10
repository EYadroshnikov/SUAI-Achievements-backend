import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { GroupDto } from '../../groups/dtos/group.dto';
import { InstituteDto } from '../../institues/dtos/institute.dto';

@Exclude()
export class TopStudentDto {
  @ApiProperty({ required: false })
  @Expose()
  uuid: string;

  @ApiProperty({ required: false })
  @Expose()
  firstName?: string;

  @ApiProperty({ required: false })
  @Expose()
  lastName?: string;

  @ApiProperty({ required: false })
  @Expose()
  institute?: InstituteDto;

  @ApiProperty({ required: false })
  @Expose()
  group?: GroupDto;

  @ApiProperty({ required: false })
  @Expose()
  avatar?: string;

  @ApiProperty()
  @Expose()
  balance: number;
}
