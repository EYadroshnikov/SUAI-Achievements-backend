import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { EducationType } from '../enums/education-type.enum';
import { BskStatus } from '../enums/bsk-status.enum';
import { CardStatus } from '../enums/card-status.enum';
import { GroupRole } from '../enums/group-role.enum';

@Exclude()
export class SocialPassportDto {
  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  groupName: string;

  @ApiProperty({ required: false })
  @Expose()
  phone?: string;

  @ApiProperty()
  @Expose()
  vkId: string;

  @ApiProperty()
  @Expose()
  tgUserName: string;

  @ApiProperty({ enum: EducationType, required: false })
  @Expose()
  educationType?: EducationType;

  @ApiProperty({ required: false })
  @Expose()
  region?: string;

  @ApiProperty({ required: false })
  @Expose()
  socialCategory?: string;

  @ApiProperty({ enum: BskStatus })
  @Expose()
  bskStatus: BskStatus;

  @ApiProperty()
  @Expose()
  medicalRegistration: boolean;

  @ApiProperty({ required: false })
  @Expose()
  militaryRegistration?: boolean;

  @ApiProperty()
  @Expose()
  passStatus: boolean;

  @ApiProperty({ enum: CardStatus })
  @Expose()
  studentIdStatus: CardStatus;

  @ApiProperty()
  @Expose()
  preferentialTravelCard: boolean;

  @ApiProperty()
  @Expose()
  profcomApplication: boolean;

  @ApiProperty({ enum: CardStatus })
  @Expose()
  profcomCardStatus: CardStatus;

  @ApiProperty({ enum: CardStatus })
  @Expose()
  scholarshipCardStatus: CardStatus;

  @ApiProperty()
  @Expose()
  certificateOrContract: boolean;

  @ApiProperty()
  @Expose()
  competenceCenterTest: boolean;

  @ApiProperty({ enum: GroupRole })
  @Expose()
  groupRole: GroupRole;

  @ApiProperty({ required: false })
  @Expose()
  hobby?: string;

  @ApiProperty({ required: false })
  @Expose()
  studentGovernment?: string;

  @ApiProperty({ required: false })
  @Expose()
  hardSkills?: string;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}
