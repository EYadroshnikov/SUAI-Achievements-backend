import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserRole } from '../enums/user-role.enum';
import { Group } from '../../groups/entities/group.entity';
import { Institute } from '../../institues/entities/institute.entity';
import { IssuedAchievement } from '../../achievements/entities/issued-achievement.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ name: 'registration_code', type: 'varchar' })
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

  @ManyToOne(() => Institute, (institute) => institute.users, {
    nullable: true,
  })
  institute: Institute;

  @ManyToOne(() => Group, (group) => group.users, { nullable: true })
  group: Group;

  @Column()
  is_banned: boolean;

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
