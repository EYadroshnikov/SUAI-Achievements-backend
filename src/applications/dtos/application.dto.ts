import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { ApplicationStatus } from '../enums/application-status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { StudentDto } from '../../users/dtos/student.dto';
import { ProofFileDto } from './proof-file.dto';
import { UserDto } from '../../users/dtos/user.dto';

@Exclude()
export class ApplicationDto {
  @ApiProperty()
  @Expose()
  uuid: string;

  @ApiProperty({ type: StudentDto })
  @Type(() => StudentDto)
  @Expose()
  student: StudentDto;

  @ApiProperty({ required: false, type: UserDto })
  @Type(() => UserDto)
  @Expose()
  reviewer?: UserDto;

  @ApiProperty()
  @Transform(({ obj }) => obj.achievement.uuid)
  @Expose()
  achievementUuid: string;

  @ApiProperty({ required: false })
  @Expose()
  message?: string;

  @ApiProperty({ enum: ApplicationStatus })
  @Expose()
  status: ApplicationStatus;

  @ApiProperty({ type: ProofFileDto, isArray: true })
  @Type(() => ProofFileDto)
  @Expose()
  proofFiles: ProofFileDto[];

  @ApiProperty({ required: false })
  @Expose()
  response?: string;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}
