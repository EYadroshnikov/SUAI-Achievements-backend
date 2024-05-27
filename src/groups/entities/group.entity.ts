import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Institute } from '../../institues/entities/institute.entity';

@Entity('groups')
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', type: 'varchar' })
  name: string;

  @ManyToOne(() => Institute)
  @JoinColumn({ name: 'institute_id' })
  institute: Institute;

  @ManyToMany(() => User, (user) => user.sputnikGroups)
  @JoinTable({
    name: 'sputnik_groups',
    joinColumn: { name: 'group_id' },
    inverseJoinColumn: { name: 'user_uuid' },
  })
  sputniks: User[];

  @OneToMany(() => User, (user) => user.group)
  user: User;
}
