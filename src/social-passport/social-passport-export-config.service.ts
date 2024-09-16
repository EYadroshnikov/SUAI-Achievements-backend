import { Injectable } from '@nestjs/common';
import { Sex } from './enums/sex.enum';
import { BskStatus } from './enums/bsk-status.enum';
import { CardStatus } from './enums/card-status.enum';
import { EducationType } from './enums/education-type.enum';
import { GroupRole } from './enums/group-role.enum';
import { RegistrationStage } from './enums/registration-stage.enum';
import { IExportConfigService } from '../google/interfaces/export-config-service.interface';
import { formatDate } from './untils/format-date';
import { PreviousEducation } from './enums/previous-education.enum';
import { ProfcomCardStatus } from './enums/profcom-card-status';

@Injectable()
export class SocialPassportExportConfigService implements IExportConfigService {
  fieldOrder = [
    'name',
    'email',
    'phone',
    'vkId',
    'tgUserName',
    'sex',
    'birthday',
    'educationType',
    'isForeign',
    'region',
    'previousEducation',
    'ssoAccess',
    'competitiveScore',
    'socialCategory',
    'bskStatus',
    'medicalRegistration',
    'militaryRegistration',
    'passStatus',
    'studentIdStatus',
    'preferentialTravelCard',
    'profcomApplication',
    'profcomCardStatus',
    'scholarshipCardStatus',
    'dormitory',
    'competenceCenterTest',
    'groupRole',
    'hobby',
    'studios',
    'hardSkills',
    'updatedAt',
    'createdAt',
  ];

  fieldTypes = {
    sex: 'enum',
    birthday: 'date',
    competitiveScore: 'number',
    educationType: 'enum',
    vkId: 'vkLink',
    tgUserName: 'tgLink',
    isForeign: 'boolean',
    previousEducation: 'enum',
    ssoAccess: 'boolean',
    bskStatus: 'enum',
    medicalRegistration: 'enum',
    militaryRegistration: 'enum',
    passStatus: 'boolean',
    studentIdStatus: 'enum',
    preferentialTravelCard: 'enum',
    profcomApplication: 'enum',
    profcomCardStatus: 'enum',
    scholarshipCardStatus: 'boolean',
    dormitory: 'enum',
    competenceCenterTest: 'boolean',
    groupRole: 'enum',
    updatedAt: 'date',
    createdAt: 'date',
  };

  headers = {
    name: 'ФИО',
    email: 'Электронная почта',
    phone: 'Телефон',
    vkId: 'VK',
    tgUserName: 'Telegram',
    sex: 'Пол',
    birthday: 'Дата рождения',
    educationType: 'Основа обучения',
    isForeign: 'Иностранец',
    region: 'Регион',
    previousEducation: 'Предыдущее образование',
    ssoAccess: 'Доступ к личному кабинету и LMS',
    competitiveScore: 'Конкурентный балл',
    socialCategory: 'Социальные категории',
    bskStatus: 'БСК',
    medicalRegistration: 'Мед. учет',
    militaryRegistration: 'Воинский учет',
    passStatus: 'Пропуск',
    studentIdStatus: 'Студенческий билет',
    preferentialTravelCard: 'Льготный БСК',
    profcomApplication: 'Заявление в профком',
    profcomCardStatus: 'СКС РФ',
    scholarshipCardStatus: 'Стипендиальная карта',
    dormitory: 'Общежитие',
    competenceCenterTest: 'Тесты ЦК',
    groupRole: 'Роль в группе',
    hobby: 'Хобби',
    studios: 'Студии',
    hardSkills: 'Хард-скиллы',
    updatedAt: 'Обновлено',
    createdAt: 'Создано',
  };

  translations = {
    boolean: {
      true: 'Да',
      false: 'Нет',
      null: '',
    },
    dormitory: {
      true: 'Получил',
      false: 'Не получил',
      null: 'Не нуждается',
    },
    sex: {
      [Sex.MALE]: 'Парень',
      [Sex.FEMALE]: 'Девушка',
    },
    previousEducation: {
      [PreviousEducation.SCHOOL]: 'Школа',
      [PreviousEducation.COLLEGE]: 'Колледж',
      [PreviousEducation.UNIVERSITY]: 'Университет',
    },
    bskStatus: {
      [BskStatus.NO]: 'Нет',
      [BskStatus.WAITING]: 'Ожидает',
      [BskStatus.RECEIVED]: 'Получил',
    },
    cardStatus: {
      [CardStatus.NO]: 'Нет',
      [CardStatus.PHOTO_PROVIDED]: 'Загрузил фотографию',
      [CardStatus.RECEIVED]: 'Получил',
    },
    educationType: {
      [EducationType.BUDGET]: 'Бюджет',
      [EducationType.CONTRACT]: 'Контракт',
      [EducationType.SLAVISH]: 'Целевое',
    },
    groupRole: {
      [GroupRole.STUDENT]: 'Студент',
      [GroupRole.PROF_ORG]: 'Профорг',
      [GroupRole.LEADER]: 'Староста',
      [GroupRole.DEPUTY_LEADER]: 'Заместитель старосты',
    },
    medicalRegistration: {
      [RegistrationStage.NOT_STARTED]: 'Не начинал',
      [RegistrationStage.NOT_ENOUGH_DOCS]: 'Не хватает документов',
      [RegistrationStage.FINISHED]: 'Встал на учет',
    },
    militaryRegistration: {
      [RegistrationStage.NOT_STARTED]: 'Не начинал',
      [RegistrationStage.NOT_ENOUGH_DOCS]: 'Не хватает документов',
      [RegistrationStage.FINISHED]: 'Встал на учет',
    },
    preferentialTravelCard: {
      true: 'Да',
      false: 'Нет',
      null: 'Не льготник',
    },
    registrationStage: {
      [RegistrationStage.NOT_STARTED]: 'Не встал',
      [RegistrationStage.NOT_ENOUGH_DOCS]: 'Не хватает документов',
      [RegistrationStage.FINISHED]: 'Встал',
    },
    studentIdStatus: {
      [CardStatus.NO]: 'Нет',
      [CardStatus.PHOTO_PROVIDED]: 'Предоставил фото',
      [CardStatus.RECEIVED]: 'Получил',
    },
    profcomApplication: {
      true: 'Да',
      false: 'Нет',
      null: 'Отказался вступать',
    },
    profcomCardStatus: {
      [ProfcomCardStatus.NOT_DOWNLOADED]: 'Не скачал(а)',
      [ProfcomCardStatus.REGISTERED]: 'Зарегистрировался(ась)',
      [ProfcomCardStatus.CONFIRMED]: 'Подтвердил(а)',
    },
  };

  getFieldOrder(): string[] {
    return this.fieldOrder;
  }

  getHeaders(): string[] {
    return this.fieldOrder.map((field) => this.headers[field] || field);
  }

  translateField(key: string, value: any): any {
    const fieldType = this.fieldTypes[key];

    if (fieldType === 'enum' && this.translations[key]) {
      return this.translations[key][value] || value;
    }

    if (fieldType === 'date' && value instanceof Date) {
      return formatDate(value);
    }

    if (fieldType === 'boolean') {
      return this.translations['boolean'][value] || value;
    }

    if (fieldType === 'tgLink') {
      return `t.me/${value}`;
    }

    if (fieldType === 'vkLink') {
      return `vk.com/id${value}`;
    }

    return value;
  }
}
