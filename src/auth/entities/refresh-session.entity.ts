import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('refresh_sessions')
export class RefreshSession {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_uuid' })
  user: User;

  @Generated('uuid')
  @Column({ name: 'refresh_token', type: 'varchar' })
  refreshToken: string;

  @Column({ name: 'user_agent', type: 'varchar' })
  userAgent: string;

  @Column({ name: 'fingerprint', type: 'varchar' })
  fingerprint: string;

  @Column({ name: 'ip', type: 'varchar' })
  ip: string;

  @Column({ name: 'expires_at', type: 'timestamp' })
  expiresAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
