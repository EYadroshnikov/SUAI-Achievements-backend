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
import { UserRole } from '../users/enums/user-role.enum';
import { TelegramService } from '../telegram/telegram.service';
import { VkService } from '../vk/vk.service';

@Injectable()
export class SocialPassportService {
  constructor(
    @InjectRepository(SocialPassport)
    private readonly socialPassportRepository: Repository<SocialPassport>,
    private readonly userService: UsersService,
    private readonly instituteService: InstitutesService,
    private readonly googleService: GoogleService,
    private readonly groupsService: GroupsService,
    private readonly telegramService: TelegramService,
    private readonly vkService: VkService,
  ) {}
  private readonly logger: Logger = new Logger(SocialPassportService.name);

  async findOne(studentUuid: string): Promise<SocialPassportDto> {
    const socialPassport = await this.socialPassportRepository.findOneOrFail({
      where: { student: { uuid: studentUuid } },
    });
    return SocialPassportDto.fromEntity(socialPassport);
  }

  async findManyByGroupId(id: number): Promise<SocialPassportDto[]> {
    const socialPassports = await this.socialPassportRepository.find({
      where: { student: { group: { id } } },
    });
    return socialPassports.map((passport) =>
      SocialPassportDto.fromEntity(passport),
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

  async getSpreadsheetLink(userUuid: string) {
    const user = await this.userService.findOne({
      where: { uuid: userUuid },
      loadEagerRelations: false,
      relations: ['institute'],
    });
    return `https://docs.google.com/spreadsheets/d/${user.institute.spreadSheetId}`;
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

  @Cron(CronExpression.EVERY_3_HOURS)
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

  async notifyToFillPassport() {
    const students = await this.userService.getAllowedPushStudents(false);
    const telegramMessage = `📝 Осталось совсем немного, пора обновить <b>социальный паспорт</b> в приложении ачивки в ВК! 🎓
https://vk.com/app51729664#/edit_social_passport/`;
    const vkMessage = `📝 Осталось совсем немного, пора обновить социальный паспорт в приложении ачивки в ВК! 🎓 
    https://vk.com/app51729664#/edit_social_passport/`;
    for (const student of students) {
      if (student.tgId) {
        await this.telegramService.addToTelegramNotificationQueue(
          student.tgId,
          telegramMessage,
        );
      }
      await this.vkService.addToVkNotificationQueue(student.vkId, vkMessage);
    }
    return true;
  }

  async pushToFillPassport() {
    const students = await this.userService.getAllowedPushStudents(true);
    const message = 'Время обновить информацию в социальном паспорте!';
    for (const student of students) {
      await this.vkService.addToPushQueue(student.vkId, message);
    }
  }
}
