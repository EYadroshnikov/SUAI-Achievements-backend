import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Achievement } from '../../achievements/entities/achievement.entity';
import { ApplicationStatus } from '../enums/application-status.enum';
import { ProofFile } from './proof-file.entity';

@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'student_uuid' })
  student: User;

  @ManyToOne(() => User, { nullable: true, eager: true })
  @JoinColumn({ name: 'reviewer_uuid' })
  reviewer?: User;

  @ManyToOne(() => Achievement, { eager: true })
  @JoinColumn({ name: 'achievement_uuid' })
  achievement: Achievement;

  @Column({
    name: 'status',
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.PENDING,
  })
  status: ApplicationStatus;

  @OneToMany(() => ProofFile, (proofFile) => proofFile.application, {
    eager: true,
  })
  proofFiles?: ProofFile[];

  @Column({
    name: 'rejection_reason',
    type: 'varchar',
    nullable: true,
    default: null,
  })
  rejectionReason?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
