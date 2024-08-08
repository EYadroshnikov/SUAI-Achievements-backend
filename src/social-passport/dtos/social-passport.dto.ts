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

@Exclude()
export class SocialPassportDto {
  @ApiProperty()
  @Expose()
  name: string; // ФИО

  @ApiProperty()
  @Expose()
  groupName: string; // Номер группы

  @ApiProperty({ required: false })
  @Expose()
  phone?: string; // Телефон

  @ApiProperty()
  @Expose()
  vkId: string; // VK

  @ApiProperty()
  @Expose()
  tgUserName: string; //Telegram

  @ApiProperty({ enum: EducationType, required: false })
  @Expose()
  educationType?: EducationType | RuEducationType; // Бюджет/контракт

  @ApiProperty({ required: false })
  @Expose()
  region?: string; // Регион

  @ApiProperty({ required: false })
  @Expose()
  socialCategory?: string; //Социальная категория

  @ApiProperty({ enum: BskStatus })
  @Expose()
  bskStatus: BskStatus | RuBskStatus; // Статус БСК

  @ApiProperty({ type: 'boolean' })
  @Expose()
  medicalRegistration: boolean | string; // Постановка на мед. учёт

  @ApiProperty({ required: false, type: 'boolean' })
  @Expose()
  militaryRegistration?: boolean | string; // Постановка на воинский учёт

  @ApiProperty({ type: 'boolean' })
  @Expose()
  passStatus: boolean | string; // Получение пропуска

  @ApiProperty({ enum: CardStatus })
  @Expose()
  studentIdStatus: CardStatus | RuCardStatus; // Получение студенческого билета

  @ApiProperty({ type: 'boolean' })
  @Expose()
  preferentialTravelCard: boolean | string; // Оформление льготного БСК

  @ApiProperty({ type: 'boolean' })
  @Expose()
  profcomApplication: boolean | string; // Заполнение заявления в профком

  @ApiProperty({ enum: CardStatus })
  @Expose()
  profcomCardStatus: CardStatus | RuCardStatus; // Получение профсоюзного билета

  @ApiProperty({ enum: CardStatus })
  @Expose()
  scholarshipCardStatus: CardStatus | RuCardStatus; // Получение стипендиальной карты

  @ApiProperty({ type: 'boolean' })
  @Expose()
  certificateOrContract: boolean | string; // Сдача оригинала аттестата/подписание договора

  @ApiProperty({ type: 'boolean' })
  @Expose()
  competenceCenterTest: boolean | string; // Прохождение тестов Центра Компетенций

  @ApiProperty({ enum: GroupRole })
  @Expose()
  groupRole: GroupRole | RuGroupRole; // Роль в группе

  @ApiProperty({ required: false })
  @Expose()
  hobby?: string; // Хобби

  @ApiProperty({ required: false })
  @Expose()
  studentGovernment?: string; // Принадлежность к органам студенческого самоуправления

  @ApiProperty({ required: false })
  @Expose()
  hardSkills?: string; // Что умеет делать профессионально

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}
