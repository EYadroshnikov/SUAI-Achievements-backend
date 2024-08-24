import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { BskStatus } from '../enums/bsk-status.enum';
import { CardStatus } from '../enums/card-status.enum';
import { RegistrationStage } from '../enums/registration-stage.enum';

@Exclude()
export class PartialSocialPassportDto {
  @ApiProperty()
  @Expose()
  user_uuid: string;

  @ApiProperty({ enum: BskStatus })
  @Expose()
  bskStatus: BskStatus;

  @ApiProperty({ enum: RegistrationStage })
  @Expose()
  medicalRegistration: RegistrationStage;

  @ApiProperty({ enum: RegistrationStage, nullable: true })
  @Expose()
  militaryRegistration: RegistrationStage;

  @ApiProperty({ type: 'boolean' })
  @Expose()
  profcomApplication: boolean;

  @ApiProperty({ enum: CardStatus })
  @Expose()
  profcomCardStatus: CardStatus;

  @ApiProperty({ type: 'boolean' })
  @Expose()
  ssoAccess: boolean;

  @ApiProperty({ type: 'boolean' })
  @Expose()
  passStatus: boolean;

  @ApiProperty({ enum: CardStatus })
  @Expose()
  studentIdStatus: CardStatus;

  @ApiProperty({ type: 'boolean', nullable: true })
  @Expose()
  preferentialTravelCard: boolean;

  @ApiProperty({ type: 'boolean', nullable: true })
  @Expose()
  scholarshipCardStatus: boolean;

  @ApiProperty({ type: 'boolean' })
  @Expose()
  competenceCenterTest: boolean;

  @ApiProperty()
  @Expose()
  studiosCount: number;
}
