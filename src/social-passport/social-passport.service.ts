import { Injectable, Logger } from '@nestjs/common';
import { SocialPassport } from './entities/social-passport.entity';
import { SocialPassportDto } from './dtos/social-passport.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CreateSocialPassportDto } from './dtos/create-social-passport.dto';
import { AuthorizedUserDto } from '../common/dtos/authorized-user.dto';
import { UsersService } from '../users/users.service';
import { GroupRole } from './enums/group-role.enum';
import { InstitutesService } from '../institues/institutes.service';
// import { GoogleService } from '../google/google.service';
import { translate } from './untils/translate.index';
import { UpdateSocialPassportDto } from './dtos/update-social-passport.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { GoogleService } from '../google/google.service';
import { formatDate } from './untils/format-date';
import { translateRegistrationStage } from './untils/translate-registration-stage';

@Injectable()
export class SocialPassportService {
  constructor(
    @InjectRepository(SocialPassport)
    private readonly socialPassportRepository: Repository<SocialPassport>,
    private readonly userService: UsersService,
    private readonly instituteService: InstitutesService,
    private readonly googleService: GoogleService,
  ) {}
  private readonly logger: Logger = new Logger(SocialPassportDto.name);

  async findOne(studentUuid: string): Promise<SocialPassportDto> {
    const socialPassport = await this.socialPassportRepository.findOneOrFail({
      where: { student: { uuid: studentUuid } },
    });
    return {
      name:
        socialPassport.student.firstName +
        ' ' +
        socialPassport.student.lastName +
        ' ' +
        socialPassport.student.patronymic,
      groupName: socialPassport.student.group.name,
      vkId: socialPassport.student.vkId,
      tgUserName: socialPassport.student.tgUserName,
      ...socialPassport,
    };
  }

  async findSocialPassportsByGroupId(groupId: string) {
    return this.socialPassportRepository
      .createQueryBuilder('social_passport')
      .select([
        'social_passport.bskStatus',
        'social_passport.medicalRegistration',
        'social_passport.militaryRegistration',
        'social_passport.profcomApplication',
        'social_passport.profcomCardStatus',
        'social_passport.ssoAccess',
        'social_passport.passStatus',
        'social_passport.studentIdStatus',
        'social_passport.preferentialTravelCard',
        'social_passport.scholarshipCardStatus',
        'social_passport.competenceCenterTest',
        'social_passport.studios',
        'user.uuid',
      ])
      .innerJoin('social_passport.student', 'user')
      .where('user.group_id = :groupId', { groupId })
      .getMany()
      .then((socialPassports) =>
        socialPassports.map((passport) => ({
          user_uuid: passport.student.uuid,
          bskStatus: passport.bskStatus,
          medicalRegistration: passport.medicalRegistration,
          militaryRegistration: passport.militaryRegistration,
          profcomApplication: passport.profcomApplication,
          profcomCardStatus: passport.profcomCardStatus,
          ssoAccess: passport.ssoAccess,
          passStatus: passport.passStatus,
          studentIdStatus: passport.studentIdStatus,
          preferentialTravelCard: passport.preferentialTravelCard,
          scholarshipCardStatus: passport.scholarshipCardStatus,
          competenceCenterTest: passport.competenceCenterTest,
          studiosCount: passport.studios
            ? passport.studios.split(',').length
            : 0,
        })),
      );
  }

  async findGroupsPassports(groupId: number): Promise<SocialPassport[]> {
    return this.socialPassportRepository.find({
      where: { student: { group: { id: groupId } } },
    });
  }

  async create(
    user: AuthorizedUserDto,
    createSocialPassportDto: CreateSocialPassportDto,
  ): Promise<SocialPassport> {
    const student = await this.userService.getStudent(user.uuid);
    const socialPassport = this.socialPassportRepository.create({
      student,
      ...createSocialPassportDto,
    });
    return this.socialPassportRepository.save(socialPassport);
  }

  async update(
    userUuid: string,
    updateSocialPassportDto: UpdateSocialPassportDto,
  ): Promise<UpdateResult> {
    return this.socialPassportRepository.update(
      { student: { uuid: userUuid } },
      updateSocialPassportDto,
    );
  }

  async setGroupRole(studentUuid: string, role: GroupRole) {
    return this.socialPassportRepository.update(
      { student: { uuid: studentUuid } },
      { groupRole: role },
    );
  }

  // @Cron(CronExpression.EVERY_DAY_AT_3AM, {
  //   name: 'export social passports',
  //   timeZone: 'Europe/Moscow',
  // }) TODO: uncomment cron task
  // async exportDataToSheets() {
  //   this.logger.log('Cron task "export social passports" has started');
  //   const institutes = await this.instituteService.getAllWithGroups();
  //
  //   for (const institute of institutes) {
  //     if (!institute.spreadSheetId) {
  //       continue;
  //     }
  //
  //     const auth = this.googleService.getAuth();
  //     const sheets = this.googleService.getSheets(auth);
  //
  //     for (const group of institute.groups) {
  //       const rawPassports = await this.findGroupsPassports(group.id);
  //       const socialPassports: SocialPassportDto[] = rawPassports.map(
  //         (passport) => this.formatSocialPassport(passport),
  //       );
  //
  //       const sheetName = group.name;
  //
  //       const headers = [
  //         'ФИО',
  //         'Номер группы',
  //         'Телефон',
  //         'VK',
  //         'Telegram',
  //         'Бюджет/контракт',
  //         'Регион',
  //         'Социальная категория',
  //         'Статус БСК',
  //         'Постановка на мед. учёт',
  //         'Постановка на воинский учёт',
  //         'Получение пропуска',
  //         'Получение студенческого билета',
  //         'Оформление льготного БСК',
  //         'Заполнение заявления в профком',
  //         'Получение профсоюзного билета',
  //         'Получение стипендиальной карты',
  //         'Прохождение тестов Центра Компетенций',
  //         'Роль в группе',
  //         'Хобби',
  //         'Принадлежность к органам студенческого самоуправления',
  //         'Что умеет делать профессионально',
  //         'Последнее обновление',
  //         'Создано',
  //       ];
  //
  //       // Создайте массив объектов для каждого паспорта
  //       const dataRows = socialPassports.map((passport) => ({
  //         ФИО: passport.name,
  //         'Номер группы': passport.groupName,
  //         Телефон: passport.phone || '',
  //         VK: passport.vkId,
  //         Telegram: passport.tgUserName,
  //         'Бюджет/контракт': passport.educationType || '',
  //         Регион: passport.region || '',
  //         'Социальная категория': passport.socialCategory || '',
  //         'Статус БСК': passport.bskStatus || '',
  //         'Постановка на мед. учёт': passport.medicalRegistration,
  //         'Постановка на воинский учёт': passport.militaryRegistration,
  //         'Получение пропуска': passport.passStatus,
  //         'Получение студенческого билета': passport.studentIdStatus,
  //         'Оформление льготного БСК': passport.preferentialTravelCard,
  //         'Заполнение заявления в профком': passport.profcomApplication,
  //         'Получение профсоюзного билета': passport.profcomCardStatus,
  //         'Получение стипендиальной карты': passport.scholarshipCardStatus,
  //         'Прохождение тестов Центра Компетенций':
  //           passport.competenceCenterTest,
  //         'Роль в группе': passport.groupRole,
  //         Хобби: passport.hobby || '',
  //         'Принадлежность к органам студенческого самоуправления':
  //           passport.studios || '',
  //         'Что умеет делать профессионально': passport.hardSkills || '',
  //         Создано: formatDate(passport.createdAt),
  //         'Последнее обновление': formatDate(passport.updatedAt),
  //       }));
  //
  //       // Преобразуйте объекты в массив значений
  //       const values = [
  //         headers,
  //         ...dataRows.map((row) => headers.map((header) => row[header])),
  //       ];
  //       await this.googleService.clearSheet(
  //         sheets,
  //         institute.spreadSheetId,
  //         sheetName,
  //       );
  //       await this.googleService.updateSocialPassportSheet(
  //         sheets,
  //         institute.spreadSheetId,
  //         sheetName,
  //         values,
  //       );
  //     }
  //   }
  //   this.logger.log('Cron task "export social passports" has finished');
  // }
  //
  // formatSocialPassport(passport: SocialPassport): SocialPassportDto {
  //   return {
  //     name:
  //       passport.student.firstName +
  //       ' ' +
  //       passport.student.lastName +
  //       ' ' +
  //       passport.student.lastName,
  //     groupName: passport.student.group.name,
  //     phone: passport.phone,
  //     vkId: `https://vk.com/id${passport.student.vkId}`,
  //     tgUserName: '@' + passport.student.tgUserName,
  //     educationType: translate.educationType(passport.educationType),
  //     region: passport.region,
  //     socialCategory: passport.socialCategory,
  //     bskStatus: translate.bskStatus(passport.bskStatus),
  //     medicalRegistration: translate.RegistrationStage(
  //       passport.medicalRegistration,
  //     ),
  //     militaryRegistration: translate.RegistrationStage(
  //       passport.militaryRegistration,
  //     ),
  //     passStatus: translate.booleanStatement(passport.passStatus),
  //     studentIdStatus: translate.cardStatus(passport.studentIdStatus),
  //     preferentialTravelCard: translate.preferentialTravelCard(
  //       passport.preferentialTravelCard,
  //     ),
  //     profcomApplication: translate.booleanStatement(
  //       passport.profcomApplication,
  //     ),
  //     profcomCardStatus: translate.cardStatus(passport.profcomCardStatus),
  //     scholarshipCardStatus: translate.booleanStatement(
  //       passport.scholarshipCardStatus,
  //     ),
  //     competenceCenterTest: translate.booleanStatement(
  //       passport.competenceCenterTest,
  //     ),
  //     groupRole: translate.groupRole(passport.groupRole),
  //     hobby: passport.hobby,
  //     studios: passport.studios,
  //     hardSkills: passport.hardSkills,
  //     createdAt: passport.createdAt,
  //     updatedAt: passport.updatedAt,
  //   };
  // }
}
