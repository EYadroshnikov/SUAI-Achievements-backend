import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Institute } from '../../institues/entities/institute.entity';
import { Speciality } from '../../specialties/enities/speciality.entity';

@Entity('groups')
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', type: 'varchar', unique: true })
  name: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

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
