import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserRole } from '../enums/user-role.enum';
import { Group } from '../../groups/entities/group.entity';
import { Institute } from '../../institues/entities/institute.entity';
import { IssuedAchievement } from '../../achievements/entities/issued-achievement.entity';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Exclude()
  uuid: string;

  @Column({ name: 'registration_code', type: 'varchar' })
  @Exclude()
  registrationCode: string;

  @Column({ name: 'vk_id', type: 'varchar' })
  vkId: string;

  @Column({ name: 'role', type: 'enum', enum: UserRole })
  role: UserRole;

  @Column({ name: 'first_name', type: 'varchar' })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar' })
  lastName: string;

  @Column({ name: 'patronymic', type: 'varchar' })
  patronymic: string;

  @Column({ name: 'balance', type: 'integer' })
  balance: number;

  @ManyToOne(() => Institute, { nullable: true })
  @JoinColumn({ name: 'institute_id' })
  institute: Institute;

  @Column({ default: false })
  is_banned: boolean;

  @ManyToMany(() => Group, (group) => group.sputniks)
  sputnikGroups: Group[];

  @ManyToOne(() => Group, { nullable: true })
  @JoinColumn({ name: 'group_id' })
  group: Group;

  @OneToMany(
    () => IssuedAchievement,
    (issuedAchievement) => issuedAchievement.issuer,
  )
  issuedAchievements: IssuedAchievement[];

  @OneToMany(
    () => IssuedAchievement,
    (issuedAchievement) => issuedAchievement.student,
  )
  receivedAchievements: IssuedAchievement[];
}
