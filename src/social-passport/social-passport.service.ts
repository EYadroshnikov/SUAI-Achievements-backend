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
import { GoogleService } from '../google/google.service';
import { translate } from './untils/translate.index';
import { UpdateSocialPassportDto } from './dtos/update-social-passport.dto';
import { Cron, CronExpression } from '@nestjs/schedule';

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
        socialPassport.student.lastName,
      groupName: socialPassport.student.group.name,
      vkId: socialPassport.student.vkId,
      tgUserName: socialPassport.student.tgUserName,
      ...socialPassport,
    };
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
    user: AuthorizedUserDto,
    updateSocialPassportDto: UpdateSocialPassportDto,
  ): Promise<UpdateResult> {
    return this.socialPassportRepository.update(
      { student: { uuid: user.uuid } },
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
  async exportDataToSheets() {
    this.logger.log('Cron task "export social passports" has started');
    const institutes = await this.instituteService.getAllWithGroups();

    for (const institute of institutes) {
      if (!institute.spreadSheetId) {
        continue;
      }

      const auth = this.googleService.getAuth();
      const sheets = this.googleService.getSheets(auth);

      for (const group of institute.groups) {
        const rawPassports = await this.findGroupsPassports(group.id);
        const socialPassports: SocialPassportDto[] = rawPassports.map(
          (passport) => this.formatSocialPassport(passport),
        );

        const sheetName = group.name;

        const headers = [
          'ФИО',
          'Номер группы',
          'Телефон',
          'VK',
          'Telegram',
          'Бюджет/контракт',
          'Регион',
          'Социальная категория',
          'Статус БСК',
          'Постановка на мед. учёт',
          'Постановка на воинский учёт',
          'Получение пропуска',
          'Получение студенческого билета',
          'Оформление льготного БСК',
          'Заполнение заявления в профком',
          'Получение профсоюзного билета',
          'Получение стипендиальной карты',
          'Сдача оригинала аттестата/подписание договора',
          'Прохождение тестов Центра Компетенций',
          'Роль в группе',
          'Хобби',
          'Принадлежность к органам студенческого самоуправления',
          'Что умеет делать профессионально',
          'Created At',
          'Updated At',
        ];

        // Создайте массив объектов для каждого паспорта
        const dataRows = socialPassports.map((passport) => ({
          ФИО: passport.name,
          'Номер группы': passport.groupName,
          Телефон: passport.phone || '',
          VK: passport.vkId,
          Telegram: passport.tgUserName,
          'Бюджет/контракт': passport.educationType || '',
          Регион: passport.region || '',
          'Социальная категория': passport.socialCategory || '',
          'Статус БСК': passport.bskStatus || '',
          'Постановка на мед. учёт': passport.medicalRegistration,
          'Постановка на воинский учёт': passport.militaryRegistration,
          'Получение пропуска': passport.passStatus,
          'Получение студенческого билета': passport.studentIdStatus,
          'Оформление льготного БСК': passport.preferentialTravelCard,
          'Заполнение заявления в профком': passport.profcomApplication,
          'Получение профсоюзного билета': passport.profcomCardStatus,
          'Получение стипендиальной карты': passport.scholarshipCardStatus,
          'Сдача оригинала аттестата/подписание договора':
            passport.certificateOrContract,
          'Прохождение тестов Центра Компетенций':
            passport.competenceCenterTest,
          'Роль в группе': passport.groupRole,
          Хобби: passport.hobby || '',
          'Принадлежность к органам студенческого самоуправления':
            passport.studentGovernment || '',
          'Что умеет делать профессионально': passport.hardSkills || '',
          'Created At': passport.createdAt.toISOString(),
          'Updated At': passport.updatedAt.toISOString(),
        }));

        // Преобразуйте объекты в массив значений
        const values = [
          headers,
          ...dataRows.map((row) => headers.map((header) => row[header])),
        ];
        await this.googleService.clearSheet(
          sheets,
          institute.spreadSheetId,
          sheetName,
        );
        await this.googleService.updateSheet(
          sheets,
          institute.spreadSheetId,
          sheetName,
          values,
        );
      }
    }
    this.logger.log('Cron task "export social passports" has finished');
  }

  formatSocialPassport(passport: SocialPassport): SocialPassportDto {
    return {
      name:
        passport.student.firstName +
        ' ' +
        passport.student.lastName +
        ' ' +
        passport.student.lastName,
      groupName: passport.student.group.name,
      phone: passport.phone,
      vkId: `https://vk.com/id${passport.student.vkId}`,
      tgUserName: '@' + passport.student.tgUserName,
      educationType: translate.educationType(passport.educationType),
      region: passport.region,
      socialCategory: passport.socialCategory,
      bskStatus: translate.bskStatus(passport.bskStatus),
      medicalRegistration: translate.booleanStatement(
        passport.medicalRegistration,
      ),
      militaryRegistration: translate.militaryRegistration(
        passport.militaryRegistration,
      ),
      passStatus: translate.booleanStatement(passport.passStatus),
      studentIdStatus: translate.cardStatus(passport.studentIdStatus),
      preferentialTravelCard: translate.preferentialTravelCard(
        passport.preferentialTravelCard,
      ),
      profcomApplication: translate.booleanStatement(
        passport.profcomApplication,
      ),
      profcomCardStatus: translate.cardStatus(passport.profcomCardStatus),
      scholarshipCardStatus: translate.cardStatus(
        passport.scholarshipCardStatus,
      ),
      certificateOrContract: translate.booleanStatement(
        passport.certificateOrContract,
      ),
      competenceCenterTest: translate.booleanStatement(
        passport.competenceCenterTest,
      ),
      groupRole: translate.groupRole(passport.groupRole),
      hobby: passport.hobby,
      studentGovernment: passport.studentGovernment,
      hardSkills: passport.hardSkills,
      createdAt: passport.createdAt,
      updatedAt: passport.updatedAt,
    };
  }
}
