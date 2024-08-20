import { ApiProperty } from '@nestjs/swagger';
import { EducationType } from '../enums/education-type.enum';
import { BskStatus } from '../enums/bsk-status.enum';
import { CardStatus } from '../enums/card-status.enum';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Sex } from '../enums/sex.enum';
import { PreviousEducation } from '../enums/previous-education.enum';
import { RegistrationStage } from '../enums/registration-stage.enum';

export class CreateSocialPassportDto {
  @ApiProperty()
  phone: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({ enum: Sex })
  @IsEnum(Sex)
  sex: Sex;

  @ApiProperty()
  @IsDate()
  birthday: Date;

  @ApiProperty()
  @IsBoolean()
  isForeign: boolean;

  @ApiProperty({ enum: PreviousEducation })
  @IsEnum(PreviousEducation)
  previousEducation: PreviousEducation;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  ssoAccess?: boolean;

  @ApiProperty()
  @IsNumber()
  competitiveScore: number;

  @ApiProperty({ enum: EducationType })
  @IsEnum(EducationType)
  educationType?: EducationType;

  @ApiProperty()
  region?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  socialCategory?: string;

  @ApiProperty({ enum: BskStatus, required: false })
  @IsOptional()
  @IsEnum(BskStatus)
  bskStatus?: BskStatus;

  @ApiProperty({ enum: RegistrationStage, required: false })
  @IsOptional()
  medicalRegistration?: RegistrationStage;

  @ApiProperty({ enum: RegistrationStage, required: false })
  @IsOptional()
  militaryRegistration?: RegistrationStage;

  @ApiProperty({ required: false })
  @IsOptional()
  passStatus?: boolean;

  @ApiProperty({ enum: CardStatus, required: false })
  @IsOptional()
  @IsEnum(CardStatus)
  studentIdStatus?: CardStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  preferentialTravelCard?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  profcomApplication?: boolean;

  @ApiProperty({ enum: CardStatus, required: false })
  @IsOptional()
  @IsEnum(CardStatus)
  profcomCardStatus?: CardStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  scholarshipCardStatus?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  dormitory?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  competenceCenterTest?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  hobby?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  studios?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  hardSkills?: string;
}
