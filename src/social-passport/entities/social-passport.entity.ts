import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { EducationType } from '../enums/education-type.enum';
import { BskStatus } from '../enums/bsk-status.enum';
import { GroupRole } from '../enums/group-role.enum';
import { CardStatus } from '../enums/card-status.enum';
import { Sex } from '../enums/sex.enum';
import { PreviousEducation } from '../enums/previous-education.enum';
import { RegistrationStage } from '../enums/registration-stage.enum';

@Entity('social_passport')
export class SocialPassport {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @OneToOne(() => User, (user) => user.socialPassport, { eager: true })
  @JoinColumn({ name: 'user_uuid' })
  student: User;

  @Column({ name: 'sex', type: 'enum', enum: Sex })
  sex: Sex;

  @Column({ name: 'birthday', type: 'date' })
  birthday: Date;

  @Column({ name: 'phone', type: 'varchar' })
  phone: string;

  @Column({ name: 'email', type: 'varchar' })
  email: string;

  @Column({ name: 'is_foreign', type: 'boolean' })
  isForeign: boolean;

  @Column({ name: 'previous_education', type: 'enum', enum: PreviousEducation })
  previousEducation: PreviousEducation;

  @Column({ name: 'sso_access', type: 'boolean', default: false })
  ssoAccess: boolean;

  @Column({ name: 'competitive_score', type: 'integer' })
  competitiveScore: number;

  @Column({
    name: 'education_type',
    type: 'enum',
    enum: EducationType,
  })
  educationType: EducationType;

  @Column({ name: 'region', type: 'varchar' })
  region: string;

  @Column({ name: 'social_category', type: 'varchar', nullable: true })
  socialCategory: string;

  @Column({
    name: 'bsk_status',
    type: 'enum',
    enum: BskStatus,
    default: BskStatus.NO,
  })
  bskStatus: BskStatus;

  @Column({
    name: 'medical_registration',
    type: 'enum',
    enum: RegistrationStage,
    default: RegistrationStage.NOT_STARTED,
  })
  medicalRegistration: RegistrationStage;

  @Column({
    name: 'military_registration',
    type: 'enum',
    enum: RegistrationStage,
    default: RegistrationStage.NOT_REQUIRED,
  })
  militaryRegistration: RegistrationStage;

  @Column({
    name: 'dormitory',
    type: 'boolean',
    nullable: true,
    default: false,
  })
  dormitory: boolean;

  @Column({ name: 'pass_status', type: 'boolean', default: false })
  passStatus: boolean;

  @Column({
    name: 'student_id_status',
    type: 'enum',
    enum: CardStatus,
    default: CardStatus.NO,
  })
  studentIdStatus: CardStatus;

  @Column({
    name: 'preferential_travel_card',
    type: 'boolean',
    nullable: true,
    default: null,
  })
  preferentialTravelCard: boolean;

  @Column({
    name: 'profcom_application',
    type: 'boolean',
    default: false,
    nullable: true,
  })
  profcomApplication: boolean;

  @Column({
    name: 'profcom_card_status',
    type: 'enum',
    enum: CardStatus,
    default: CardStatus.NO,
  })
  profcomCardStatus: CardStatus;

  @Column({
    name: 'scholarship_card_status',
    type: 'boolean',
    nullable: true,
    default: false,
  })
  scholarshipCardStatus: boolean;

  @Column({
    name: 'competence_center_test',
    type: 'boolean',
    default: false,
  })
  competenceCenterTest: boolean;

  @Column({
    name: 'group_role',
    type: 'enum',
    enum: GroupRole,
    default: GroupRole.STUDENT,
  })
  groupRole: GroupRole;

  @Column({ name: 'hobby', type: 'varchar', nullable: true })
  hobby: string;

  @Column({ name: 'studios', type: 'varchar', nullable: true })
  studios: string;

  @Column({ name: 'hard_skills', type: 'varchar', nullable: true })
  hardSkills: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
