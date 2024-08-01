import { ApiProperty } from '@nestjs/swagger';
import { AchievementDto } from './achievement.dto';
import { UserDto } from '../../users/dtos/user.dto';
import { StudentDto } from '../../users/dtos/student.dto';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class IssuedAchievementDto {
  @ApiProperty({ type: AchievementDto })
  @Expose()
  @Type(() => AchievementDto)
  achievement: AchievementDto;

  @ApiProperty({ type: UserDto })
  @Expose()
  @Type(() => UserDto)
  issuer: UserDto;

  @ApiProperty({ type: StudentDto })
  @Expose()
  @Type(() => StudentDto)
  student: StudentDto;

  @ApiProperty()
  @Expose()
  reward: number;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}
