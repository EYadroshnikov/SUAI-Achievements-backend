import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthorizedUserDto } from '../common/dtos/authorized-user.dto';
import { RequestDto } from './dtos/request.dto';
import { EntityManager, FindManyOptions, In, Not, Repository } from 'typeorm';
import { Application } from './entities/application.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { AchievementsService } from '../achievements/achievements.service';
import { FileUploadService } from './file-upload.service';
import { ProofFile } from './entities/proof-file.entity';
import * as path from 'node:path';
import * as Path from 'node:path';
import { UserRole } from '../users/enums/user-role.enum';
import { ApplicationStatus } from './enums/application-status.enum';
import { ReviewDto } from './dtos/review.dto';
import { IssuedAchievement } from '../achievements/entities/issued-achievement.entity';

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

  async isExists(
    achievementUuid: string,
    studentUuid: string,
    manager?: EntityManager,
  ): Promise<boolean> {
    const repo =
      manager?.getRepository(Application) || this.applicationRepository;
    return repo.exists({
      where: {
        student: { uuid: studentUuid },
        achievement: { uuid: achievementUuid },
        status: Not(ApplicationStatus.CANCELED),
      },
    });
  }

  async createApplication(
    user: AuthorizedUserDto,
    requestDto: RequestDto,
    files: Array<Express.Multer.File>,
  ) {
    return this.applicationRepository.manager.transaction(async (manager) => {
      const [isReceived, isApplicationExists] = await Promise.all([
        this.achievementsService.isReceived(
          requestDto.achievementUuid,
          user.uuid,
          manager,
        ),
        this.isExists(requestDto.achievementUuid, user.uuid, manager),
      ]);
      console.log();
      if (isReceived || isApplicationExists) {
        throw new ConflictException('You can not request this achievement');
      }

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
      application.message = requestDto.message;
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
        where: {
          student: { uuid: studentUuid },
          status: Not(ApplicationStatus.CANCELED),
        },
      });
    });
  }

  async approveApplication(
    uuid: string,
    reviewDto: ReviewDto,
    user: AuthorizedUserDto,
  ) {
    return this.applicationRepository.manager.transaction(async (manager) => {
      const application = await manager.findOneOrFail(Application, {
        where: {
          uuid,
          status: In([ApplicationStatus.PENDING, ApplicationStatus.REJECTED]),
        },
      });
      const reviewer = await this.userService.findOne(
        {
          where: { uuid: user.uuid },
        },
        manager,
      );
      await this.achievementsService.issueAchievement(
        user,
        {
          achievementUuid: application.achievement.uuid,
          studentUuid: application.student.uuid,
        },
        manager,
      );

      application.status = ApplicationStatus.APPROVED;
      application.reviewer = reviewer;
      application.response = reviewDto.response;
      return manager.save(application);
    });
  }

  async rejectApplication(
    uuid: string,
    reviewDto: ReviewDto,
    user: AuthorizedUserDto,
  ) {
    return this.applicationRepository.manager.transaction(async (manager) => {
      const application = await manager.findOneOrFail(Application, {
        where: {
          uuid,
          status: In([ApplicationStatus.PENDING, ApplicationStatus.APPROVED]),
        },
      });

      const reviewer = await this.userService.findOne(
        {
          where: { uuid: user.uuid },
        },
        manager,
      );

      if (application.status === ApplicationStatus.APPROVED) {
        await this.achievementsService.cancelIssuing(user, {
          achievementUuid: application.achievement.uuid,
          studentUuid: application.student.uuid,
          cancellationReason: reviewDto.response,
        });
      }

      application.status = ApplicationStatus.REJECTED;
      application.reviewer = reviewer;
      application.response = reviewDto.response;

      return manager.save(application);
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
        status: Not(ApplicationStatus.CANCELED),
      },
    });
  }

  async cancelApplication(uuid: string, user: AuthorizedUserDto) {
    return this.applicationRepository.manager.transaction(async (manager) => {
      const application = await manager.findOneOrFail(Application, {
        where: {
          uuid,
          student: { uuid: user.uuid },
          status: ApplicationStatus.PENDING,
        },
      });
      return manager.update(
        Application,
        { uuid },
        { status: ApplicationStatus.CANCELED },
      );
    });
  }

  async getFilePath(uuid: string): Promise<string> {
    const file = await this.proofFileRepository.findOneOrFail({
      where: { uuid },
    });
    return Path.join(this.fileUploadService.uploadDir, file.fileName);
  }
}
