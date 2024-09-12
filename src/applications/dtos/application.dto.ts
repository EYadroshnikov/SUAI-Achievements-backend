import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { PrimaryGeneratedColumn } from 'typeorm';
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

  @ApiProperty()
  @Type(() => StudentDto)
  @Expose()
  student: StudentDto;

  @ApiProperty({ required: false })
  @Type(() => UserDto)
  @Expose()
  reviewer?: UserDto;

  @ApiProperty()
  @Transform(({ obj }) => obj.achievement.uuid)
  @Expose()
  achievementUuid: string;

  @ApiProperty()
  @Expose()
  status: ApplicationStatus;

  @ApiProperty()
  @Type(() => ProofFileDto)
  @Expose()
  proofFiles: ProofFileDto[];

  @ApiProperty({ required: false })
  @Expose()
  rejectionReason?: string;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}
