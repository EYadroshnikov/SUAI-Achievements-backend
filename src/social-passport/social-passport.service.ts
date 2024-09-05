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
import { UpdateSocialPassportDto } from './dtos/update-social-passport.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { GoogleService } from '../google/google.service';
import { GroupsService } from '../groups/groups.service';

@Injectable()
export class SocialPassportService {
  constructor(
    @InjectRepository(SocialPassport)
    private readonly socialPassportRepository: Repository<SocialPassport>,
    private readonly userService: UsersService,
    private readonly instituteService: InstitutesService,
    private readonly googleService: GoogleService,
    private readonly groupsService: GroupsService,
  ) {}
  private readonly logger: Logger = new Logger(SocialPassportService.name);

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

  preparePassportData(passport: SocialPassport): any {
    const student = passport.student;
    return {
      name: `${student.lastName} ${student.firstName} ${student.patronymic}`,
      groupName: student.group.name,
      vkId: student.vkId,
      tgUserName: student.tgUserName,
      ...passport,
    };
  }

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async export() {
    const institutes = await this.instituteService.getAllWithGroups();
    for (const institute of institutes) {
      if (!institute.spreadSheetId) {
        continue;
      }
      for (const group of institute.groups) {
        await this.googleService.exportGroup(group, institute.spreadSheetId);
      }
      this.logger.log(`institute "${institute.name}" added to export queue`);
    }
  }

  async exportInstitute(id: number) {
    const institute = await this.instituteService.findOneWithGroups(id);
    for (const group of institute.groups) {
      await this.googleService.exportGroup(group, institute.spreadSheetId);
    }
    this.logger.log(`institute "${institute.name}" added to export queue`);
  }

  async exportGroup(id: number) {
    const group = await this.groupsService.findOneWithStudents(id);
    await this.googleService.exportGroup(group, group.institute.spreadSheetId);
    this.logger.log(`group "${group.name}" added to export queue`);
  }

  async formatAllSheets() {
    const institutes = await this.instituteService.getAllWithGroups();
    for (const institute of institutes) {
      if (!institute.spreadSheetId) {
        continue;
      }
      for (const group of institute.groups) {
        await this.googleService.formatSheet(
          group.name,
          institute.spreadSheetId,
        );
      }
      this.logger.log(`institute "${institute.name}" added to format queue`);
    }
  }
}
