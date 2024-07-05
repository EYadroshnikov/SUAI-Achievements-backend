import { ApiProperty } from '@nestjs/swagger';
import { AchievementDto } from './achievement.dto';
import { UserDto } from '../../users/dtos/user.dto';
import { StudentDto } from '../../users/dtos/student.dto';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class IssuedAchievementDto {
  @ApiProperty()
  @Expose()
  @Type(() => AchievementDto)
  achievement: AchievementDto;

  @ApiProperty()
  @Expose()
  @Type(() => UserDto)
  issuer: UserDto;

  @ApiProperty()
  @Expose()
  @Type(() => StudentDto)
  student: StudentDto;

  @ApiProperty()
  @Expose()
  reward: number;

  @ApiProperty()
  @Expose()
  isCanceled: number;

  @ApiProperty()
  @Expose()
  @Type(() => UserDto)
  canceler: UserDto;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}
