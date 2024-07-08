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
import { Speciality } from '../../specialties/enities/speciality.entity';

@Entity('groups')
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', type: 'varchar' })
  name: string;

  @ManyToOne(() => Institute)
  @JoinColumn({ name: 'institute_id' })
  institute: Institute;

  @ManyToOne(() => Speciality, { eager: true })
  @JoinColumn({ name: 'speciality_id' })
  speciality: Speciality;

  @ManyToMany(() => User, (user) => user.sputnikGroups)
  @JoinTable({
    name: 'sputnik_groups',
    joinColumn: { name: 'group_id' },
    inverseJoinColumn: { name: 'user_uuid' },
  })
  sputniks: User[];

  @OneToMany(() => User, (user) => user.group)
  students: User[];
}
