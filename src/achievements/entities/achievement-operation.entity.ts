import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AchievementOperationType } from '../enums/achievement-operation-type.enum';
import { Achievement } from './achievement.entity';
import { User } from '../../users/entities/user.entity';

@Entity('achievement_operations')
export class AchievementOperation {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ name: 'type', type: 'enum', enum: AchievementOperationType })
  type: AchievementOperationType;

  @ManyToOne(() => Achievement, { eager: true })
  @JoinColumn({ name: 'achievement_uuid' })
  achievement: Achievement;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'executor_uuid' })
  executor: User;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'student_uuid' })
  student: User;

  @Column({
    name: 'cancellation_reason',
    type: 'varchar',
    nullable: true,
    default: null,
  })
  cancellationReason?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
