import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Achievement } from './achievement.entity';
import { User } from '../../users/entities/user.entity';

@Entity('issued_achievements')
@Unique(['student', 'achievement'])
export class IssuedAchievement {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ManyToOne(() => Achievement)
  @JoinColumn({ name: 'achievement_uuid' })
  achievement: Achievement;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'issuer_uuid' })
  issuer: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'student_uuid' })
  student: User;

  @Column({ name: 'reward', type: 'integer' })
  reward: number;

  @Column({ name: 'is_canceled', type: 'boolean' })
  isCanceled: boolean;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'canceler' })
  canceler?: User;

  @Column({ name: 'cancellation_reason', type: 'varchar', nullable: true })
  cancellationReason?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
