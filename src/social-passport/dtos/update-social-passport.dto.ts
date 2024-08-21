import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { EducationType } from '../enums/education-type.enum';
import { BskStatus } from '../enums/bsk-status.enum';
import { CardStatus } from '../enums/card-status.enum';
import { Sex } from '../enums/sex.enum';
import { PreviousEducation } from '../enums/previous-education.enum';
import { RegistrationStage } from '../enums/registration-stage.enum';
//TODO: добавить новые поля
export class UpdateSocialPassportDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ enum: Sex, required: false })
  @IsOptional()
  @IsEnum(Sex)
  sex?: Sex;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  birthday?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isForeign?: boolean;

  @ApiProperty({ enum: PreviousEducation })
  @IsOptional()
  @IsEnum(PreviousEducation)
  previousEducation: PreviousEducation;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  ssoAccess: boolean;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  competitiveScore: number;

  @ApiProperty({ enum: EducationType, required: false })
  @IsOptional()
  @IsEnum(EducationType)
  educationType?: EducationType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  region?: string;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  socialCategory?: string;

  @ApiProperty({ enum: BskStatus, required: false })
  @IsOptional()
  @IsEnum(BskStatus)
  bskStatus?: BskStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  medicalRegistration?: RegistrationStage;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsBoolean()
  militaryRegistration?: RegistrationStage;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  passStatus?: boolean;

  @ApiProperty({ enum: CardStatus, required: false })
  @IsOptional()
  @IsEnum(CardStatus)
  studentIdStatus?: CardStatus;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsBoolean()
  preferentialTravelCard?: boolean;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsBoolean()
  profcomApplication?: boolean;

  @ApiProperty({ enum: CardStatus, required: false })
  @IsOptional()
  @IsEnum(CardStatus)
  profcomCardStatus?: CardStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  scholarshipCardStatus?: boolean;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsBoolean()
  dormitory?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  competenceCenterTest?: boolean;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  hobby?: string;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  studios?: string;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  hardSkills?: string;
}
