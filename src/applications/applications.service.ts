import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthorizedUserDto } from '../common/dtos/authorized-user.dto';
import { RequestDto } from './dtos/request.dto';
import { FindManyOptions, In, Not, Repository } from 'typeorm';
import { Application } from './entities/application.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { AchievementsService } from '../achievements/achievements.service';
import { FileUploadService } from './file-upload.service';
import { ProofFile } from './entities/proof-file.entity';
import * as path from 'node:path';
import { UserRole } from '../users/enums/user-role.enum';
import { ApplicationStatus } from './enums/application-status.enum';
import { RejectDto } from './dtos/reject.dto';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    @InjectRepository(ProofFile)
    private readonly proofFileRepository: Repository<ProofFile>,
    private readonly userService: UsersService,
    private readonly achievementsService: AchievementsService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  async createApplication(
    user: AuthorizedUserDto,
    requestDto: RequestDto,
    files: Array<Express.Multer.File>,
  ) {
    return this.applicationRepository.manager.transaction(async (manager) => {
      const [student, achievement] = await Promise.all([
        this.userService.findOne({ where: { uuid: user.uuid } }, manager),
        this.achievementsService.findOne(
          {
            where: { uuid: requestDto.achievementUuid },
          },
          manager,
        ),
      ]);
      const application = this.applicationRepository.create();
      application.student = student;
      application.achievement = achievement;
      await manager.save(application);

      for (const file of files) {
        const filePath = await this.fileUploadService.uploadFile(file);

        const proofFile = this.proofFileRepository.create({
          fileName: filePath,
          application: application,
          type: path.extname(file.originalname),
          mimetype: file.mimetype,
          size: file.size,
          originalname: file.originalname,
        });

        await manager.save(proofFile);
      }

      return application;
    });
  }

  async getStudentsApplications(studentUuid: string, user: AuthorizedUserDto) {
    return this.applicationRepository.manager.transaction(async (manager) => {
      if (user.uuid !== studentUuid) {
        const [student, notStudent] = await Promise.all([
          this.userService.findOne(
            {
              where: { uuid: studentUuid },
            },
            manager,
          ),
          this.userService.findOne(
            {
              where: { uuid: user.uuid, role: Not(UserRole.STUDENT) },
              loadEagerRelations: false,
              relations: ['institute', 'sputnikGroups'],
            },
            manager,
          ),
        ]);

        let isStudentInGroup = true;
        let isStudentInInstitute = true;
        if (user.role === UserRole.SPUTNIK) {
          isStudentInGroup =
            student.group &&
            notStudent.sputnikGroups.some(
              (group) => group.id === student.group.id,
            );
        } else if (user.role === UserRole.CURATOR) {
          isStudentInInstitute =
            student.group?.institute?.id === notStudent.institute?.id;
        }
        if (!isStudentInGroup || !isStudentInInstitute) {
          throw new ForbiddenException(
            "You do not have access to this student's applications",
          );
        }
      }

      return manager.find(Application, {
        where: { student: { uuid: studentUuid } },
      });
    });
  }

  async approveApplication(uuid: string, user: AuthorizedUserDto) {
    return this.applicationRepository.manager.transaction(async (manager) => {
      const application = await manager.findOneOrFail(Application, {
        where: { uuid },
      });
      const reviewer = await this.userService.findOne(
        {
          where: { uuid: user.uuid },
        },
        manager,
      );
      const issuedAchievement = await this.achievementsService.issueAchievement(
        user,
        {
          achievementUuid: application.achievement.uuid,
          studentUuid: application.student.uuid,
        },
      );

      application.status = ApplicationStatus.APPROVED;
      application.reviewer = reviewer;
      await manager.save(reviewer);
    });
  }

  async rejectApplication(
    uuid: string,
    rejectDto: RejectDto,
    user: AuthorizedUserDto,
  ) {
    return this.applicationRepository.manager.transaction(async (manager) => {
      const reviewer = await this.userService.findOne(
        {
          where: { uuid: user.uuid },
        },
        manager,
      );
      return this.applicationRepository.update(
        { uuid },
        {
          status: ApplicationStatus.REJECTED,
          reviewer: reviewer,
          rejectionReason: rejectDto.rejectionReason,
        },
      );
    });
  }

  async getApplicationsForUser(
    user: AuthorizedUserDto,
    status?: ApplicationStatus,
  ) {
    const reviewer = await this.userService.findOne({
      where: { uuid: user.uuid, role: Not(UserRole.STUDENT) },
      loadEagerRelations: false,
      relations: ['institute', 'sputnikGroups'],
    });

    const options: FindManyOptions<Application> = {};
    if (user.role === UserRole.CURATOR) {
      options.where = { student: { institute: reviewer.institute } };
    } else if (user.role === UserRole.SPUTNIK) {
      options.where = {
        student: {
          group: { id: In(reviewer.sputnikGroups.map((group) => group.id)) },
        },
      };
    }
    return this.applicationRepository.find({
      where: {
        ...options.where,
        ...(status ? { status: ApplicationStatus.PENDING } : {}),
      },
    });
  }
}
