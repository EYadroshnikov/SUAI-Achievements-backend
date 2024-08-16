import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from '../enums/user-role.enum';
import { Group } from '../../groups/entities/group.entity';
import { Institute } from '../../institues/entities/institute.entity';
import { IssuedAchievement } from '../../achievements/entities/issued-achievement.entity';
import { AchievementOperation } from '../../achievements/entities/achievement-operation.entity';
import { SocialPassport } from '../../social-passport/entities/social-passport.entity';
import { UserSettings } from '../../user-settings/entities/user-settings.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ name: 'vk_id', type: 'varchar', unique: true })
  vkId: string;

  @Column({ name: 'tg_id', type: 'varchar', unique: true, nullable: true })
  tgId: string;

  @Column({
    name: 'tg_username',
    type: 'varchar',
    unique: true,
    nullable: true,
  })
  tgUserName: string;

  @Column({ name: 'role', type: 'enum', enum: UserRole })
  role: UserRole;

  @Column({ name: 'first_name', type: 'varchar' })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar' })
  lastName: string;

  @Column({ name: 'patronymic', type: 'varchar', nullable: true })
  patronymic: string;

  @Column({ name: 'balance', type: 'integer', default: 0 })
  balance: number;

  @ManyToOne(() => Institute, { nullable: true, eager: true })
  @JoinColumn({ name: 'institute_id' })
  institute: Institute;

  @Column({ name: 'is_banned', default: false })
  isBanned: boolean;

  @ManyToMany(() => Group, (group) => group.sputniks)
  sputnikGroups: Group[];

  @ManyToOne(() => Group, { nullable: true, eager: true })
  @JoinColumn({ name: 'group_id' })
  group: Group;

  @Column({ name: 'avatar', type: 'varchar', nullable: true, default: null })
  avatar: string;

  @OneToMany(
    () => IssuedAchievement,
    (issuedAchievement) => issuedAchievement.issuer,
  )
  issuedAchievements: IssuedAchievement[];

  @OneToMany(
    () => IssuedAchievement,
    (issuedAchievement) => issuedAchievement.student,
    { cascade: ['remove'] },
  )
  receivedAchievements: IssuedAchievement[];

  @OneToMany(
    () => AchievementOperation,
    (achievementOperation) => achievementOperation.student,
    { cascade: ['remove'] },
  )
  operations: AchievementOperation[];

  @OneToOne(() => SocialPassport, (socialPassport) => socialPassport.student, {
    cascade: true,
    nullable: true,
  })
  socialPassport?: SocialPassport;

  // @OneToMany(() => RefreshSession, (refreshSession) => refreshSession.user, {
  //   cascade: ['remove'],
  //   nullable: true,
  // })
  // refreshSessions: RefreshSession[];
  // TODO: refresh session cascade delete!!!

  @OneToOne(() => UserSettings, (userSettings) => userSettings.user, {
    cascade: true,
    nullable: true, //TODO: remove
  })
  userSettings: UserSettings;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
