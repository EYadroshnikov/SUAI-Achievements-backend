import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { EducationType } from '../enums/education-type.enum';
import { BskStatus } from '../enums/bsk-status.enum';
import { CardStatus } from '../enums/card-status.enum';
import { GroupRole } from '../enums/group-role.enum';
import { Sex } from '../enums/sex.enum';
import { PreviousEducation } from '../enums/previous-education.enum';
import { RegistrationStage } from '../enums/registration-stage.enum';
import { ProfcomCardStatus } from '../enums/profcom-card-status';

@Exclude()
export class SocialPassportDto {
  @ApiProperty()
  @Expose()
  userUuid: string;

  @ApiProperty()
  @Expose()
  name: string; // ФИО

  @ApiProperty()
  @Expose()
  groupName: string; // Номер группы

  @ApiProperty()
  @Expose()
  phone: string; // Телефон

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  vkId: string; // VK

  @ApiProperty()
  @Expose()
  tgUserName: string; //Telegram

  @ApiProperty({ enum: Sex })
  @Expose()
  sex: Sex;

  @ApiProperty()
  @Expose()
  birthday: Date;

  @ApiProperty()
  @Expose()
  isForeign: boolean;

  @ApiProperty({ enum: PreviousEducation })
  @Expose()
  previousEducation: PreviousEducation;

  @ApiProperty()
  @Expose()
  ssoAccess: boolean;

  @ApiProperty()
  @Expose()
  competitiveScore: number;

  @ApiProperty({ enum: EducationType })
  @Expose()
  educationType: EducationType; // Бюджет/контракт

  @ApiProperty()
  @Expose()
  region: string; // Регион

  @ApiProperty({ nullable: true })
  @Expose()
  socialCategory: string; //Социальная категория

  @ApiProperty({ enum: BskStatus })
  @Expose()
  bskStatus: BskStatus; // Статус БСК

  @ApiProperty({ enum: RegistrationStage })
  @Expose()
  medicalRegistration: RegistrationStage; // Постановка на мед. учёт

  @ApiProperty({ enum: RegistrationStage, nullable: true })
  @Expose()
  militaryRegistration: RegistrationStage; // Постановка на воинский учёт

  @ApiProperty({ type: 'boolean' })
  @Expose()
  passStatus: boolean; // Получение пропуска

  @ApiProperty({ enum: CardStatus })
  @Expose()
  studentIdStatus: CardStatus; // Получение студенческого билета

  @ApiProperty({ type: 'boolean', nullable: true })
  @Expose()
  preferentialTravelCard: boolean; // Оформление льготного БСК

  @ApiProperty({ type: 'boolean', nullable: true })
  @Expose()
  profcomApplication: boolean; // Заполнение заявления в профком

  @ApiProperty({ enum: ProfcomCardStatus })
  @Expose()
  profcomCardStatus: ProfcomCardStatus; // Получение профсоюзного билета

  @ApiProperty({ type: 'boolean', nullable: true })
  @Expose()
  scholarshipCardStatus: boolean; // Получение стипендиальной карты

  @ApiProperty({ nullable: true })
  @Expose()
  dormitory: boolean;

  @ApiProperty({ type: 'boolean' })
  @Expose()
  competenceCenterTest: boolean; // Прохождение тестов Центра Компетенций

  @ApiProperty({ enum: GroupRole })
  @Expose()
  groupRole: GroupRole; // Роль в группе

  @ApiProperty({ nullable: true })
  @Expose()
  hobby: string; // Хобби

  @ApiProperty({ nullable: true })
  @Expose()
  studios: string; // Принадлежность к органам студенческого самоуправления

  @ApiProperty({ nullable: true, required: false })
  @Expose()
  hardSkills?: string; // Что умеет делать профессионально

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;

  static fromEntity(socialPassport: any): SocialPassportDto {
    const dto = {
      userUuid: socialPassport.student.uuid,
      name: `${socialPassport.student.lastName} ${socialPassport.student.firstName} ${socialPassport.student?.patronymic}`,
      groupName: socialPassport.student.group.name,
      vkId: socialPassport.student.vkId,
      tgUserName: socialPassport.student.tgUserName,
      ...socialPassport,
    };
    return dto;
  }
}
