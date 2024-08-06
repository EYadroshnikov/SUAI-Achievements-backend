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

@Entity('social_passport')
export class SocialPassport {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @OneToOne(() => User, (user) => user.socialPassport, { eager: true })
  @JoinColumn({ name: 'user_uuid' })
  student: User;

  @Column({ name: 'phone', type: 'varchar', nullable: true })
  phone?: string;

  @Column({
    name: 'education_type',
    type: 'enum',
    enum: EducationType,
    nullable: true,
  })
  educationType?: EducationType;

  @Column({ name: 'region', type: 'varchar', nullable: true })
  region?: string;

  @Column({ name: 'social_category', type: 'varchar', nullable: true })
  socialCategory?: string;

  @Column({
    name: 'bsk_status',
    type: 'enum',
    enum: BskStatus,
    default: BskStatus.NO,
  })
  bskStatus: BskStatus;

  @Column({ name: 'medical_registration', type: 'boolean', default: false })
  medicalRegistration: boolean;

  @Column({
    name: 'military_registration',
    type: 'boolean',
    nullable: true,
    default: null,
  })
  militaryRegistration?: boolean;

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
    name: 'preferential travel card',
    type: 'boolean',
    nullable: null,
    default: null,
  })
  preferentialTravelCard: boolean;

  @Column({ name: 'profcom_application', type: 'boolean', default: false })
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
    type: 'enum',
    enum: CardStatus,
    default: CardStatus.NO,
  })
  scholarshipCardStatus: CardStatus;

  @Column({
    name: 'certificate_or_contract',
    type: 'boolean',
    default: false,
  })
  certificateOrContract: boolean;

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
  hobby?: string;

  @Column({ name: 'student_government', type: 'varchar', nullable: true })
  studentGovernment?: string;

  @Column({ name: 'hard_skills', type: 'varchar', nullable: true })
  hardSkills?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
