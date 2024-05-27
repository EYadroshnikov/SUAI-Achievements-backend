import {
  Column,
  Entity,
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

  @ManyToOne(() => Institute, (institute) => institute.groups)
  institute: Institute;

  @OneToMany(() => User, (user) => user.group)
  users: User[];
}
