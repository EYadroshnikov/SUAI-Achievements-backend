import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { UserRole } from '../enums/user-role.enum';
import { InstituteDto } from '../../institues/dtos/institute.dto';

@Exclude()
export class UserDto {
  @ApiProperty()
  @Expose()
  uuid: string;

  @ApiProperty()
  @Expose()
  firstName: string;

  @ApiProperty()
  @Expose()
  lastName: string;

  @ApiProperty({ required: false })
  @Expose()
  patronymic?: string;

  @ApiProperty({ type: InstituteDto })
  @Type(() => InstituteDto)
  @Expose()
  institute: InstituteDto;

  @ApiProperty()
  @Expose()
  vkId: string;

  @ApiProperty()
  @Expose()
  role: UserRole;

  @ApiProperty()
  @Expose()
  isBanned: boolean;

  @ApiProperty({ required: false })
  @Expose()
  avatar?: string;
}
