import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { EducationType } from '../enums/education-type.enum';
import { BskStatus } from '../enums/bsk-status.enum';
import { CardStatus } from '../enums/card-status.enum';

export class UpdateSocialPassportDto {
  @ApiProperty({ required: false })
  @IsOptional()
  phone?: string;

  @ApiProperty({ enum: EducationType, required: false })
  @IsOptional()
  @IsEnum(EducationType)
  educationType?: EducationType;

  @ApiProperty({ required: false })
  @IsOptional()
  region?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  socialCategory?: string;

  @ApiProperty({ enum: BskStatus, required: false })
  @IsOptional()
  @IsEnum(BskStatus)
  bskStatus?: BskStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  medicalRegistration?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  militaryRegistration?: boolean;

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

  @ApiProperty({ enum: CardStatus, required: false })
  @IsOptional()
  @IsEnum(CardStatus)
  scholarshipCardStatus?: CardStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  certificateOrContract?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  competenceCenterTest?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  hobby?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  studentGovernment?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  hardSkills?: string;
}
