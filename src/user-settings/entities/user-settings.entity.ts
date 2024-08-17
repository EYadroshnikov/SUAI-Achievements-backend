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

@Entity('user_settings')
export class UserSettings {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @OneToOne(() => User, (user) => user.userSettings)
  @JoinColumn({ name: 'user_uuid' })
  user: User;

  @Column({ name: 'is_visible_in_top', type: 'boolean', default: true })
  isVisibleInTop: boolean;

  @Column({ name: 'show_unseen_achievements', type: 'boolean', default: true })
  showUnseenAchievements: boolean;

  @Column({
    name: 'receive_tg_achievement_notification',
    type: 'boolean',
    default: true,
  })
  receiveTgAchievementNotifications: boolean;

  @Column({
    name: 'receive_vk_achievement_notification',
    type: 'boolean',
    default: true,
  })
  receiveVkAchievementNotifications: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
