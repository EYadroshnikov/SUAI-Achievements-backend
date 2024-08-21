import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { EducationType } from '../enums/education-type.enum';
import { BskStatus } from '../enums/bsk-status.enum';
import { CardStatus } from '../enums/card-status.enum';
import { GroupRole } from '../enums/group-role.enum';
import { RuEducationType } from '../enums/ru-education-type.enum';
import { RuBskStatus } from '../enums/ru-bsk-status.enum';
import { RuCardStatus } from '../enums/ru-card-status.enum';
import { RuGroupRole } from '../enums/ru-group-role.enum';
import { Sex } from '../enums/sex.enum';
import { PreviousEducation } from '../enums/previous-education.enum';
import { RuPreviousEducation } from '../enums/ru-previous-education.enum';
import { RuSex } from '../enums/ru-sex.enum';
import { RegistrationStage } from '../enums/registration-stage.enum';
import { RuRegistrationStage } from '../enums/ru-registration-stage.enum';

@Exclude()
export class SocialPassportDto {
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
  sex: Sex | RuSex;

  @ApiProperty()
  @Expose()
  birthday: Date;

  @ApiProperty()
  @Expose()
  isForeign: boolean;

  @ApiProperty({ enum: PreviousEducation })
  @Expose()
  previousEducation: PreviousEducation | RuPreviousEducation;

  @ApiProperty()
  @Expose()
  ssoAccess: boolean;

  @ApiProperty()
  @Expose()
  competitiveScore: number;

  @ApiProperty({ enum: EducationType })
  @Expose()
  educationType: EducationType | RuEducationType; // Бюджет/контракт

  @ApiProperty()
  @Expose()
  region: string; // Регион

  @ApiProperty({ nullable: true })
  @Expose()
  socialCategory: string; //Социальная категория

  @ApiProperty({ enum: BskStatus })
  @Expose()
  bskStatus: BskStatus | RuBskStatus; // Статус БСК

  @ApiProperty({ enum: RegistrationStage })
  @Expose()
  medicalRegistration: RegistrationStage | RuRegistrationStage; // Постановка на мед. учёт

  @ApiProperty({ enum: RegistrationStage, nullable: true })
  @Expose()
  militaryRegistration: RegistrationStage | RuRegistrationStage; // Постановка на воинский учёт

  @ApiProperty({ type: 'boolean' })
  @Expose()
  passStatus: boolean | string; // Получение пропуска

  @ApiProperty({ enum: CardStatus })
  @Expose()
  studentIdStatus: CardStatus | RuCardStatus; // Получение студенческого билета

  @ApiProperty({ type: 'boolean', nullable: true })
  @Expose()
  preferentialTravelCard: boolean | string; // Оформление льготного БСК

  @ApiProperty({ type: 'boolean', nullable: true })
  @Expose()
  profcomApplication: boolean | string; // Заполнение заявления в профком

  @ApiProperty({ enum: CardStatus })
  @Expose()
  profcomCardStatus: CardStatus | RuCardStatus; // Получение профсоюзного билета

  @ApiProperty({ nullable: true })
  @Expose()
  scholarshipCardStatus: boolean | string; // Получение стипендиальной карты

  @ApiProperty({ nullable: true })
  @Expose()
  dormitory: boolean;

  @ApiProperty({ type: 'boolean' })
  @Expose()
  competenceCenterTest: boolean | string; // Прохождение тестов Центра Компетенций

  @ApiProperty({ enum: GroupRole })
  @Expose()
  groupRole: GroupRole | RuGroupRole; // Роль в группе

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
}
