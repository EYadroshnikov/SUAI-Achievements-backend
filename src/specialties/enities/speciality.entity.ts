import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Group } from '../../groups/entities/group.entity';
import { Institute } from '../../institues/entities/institute.entity';

@Entity('specialties')
export class Speciality {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'code', type: 'varchar' })
  code: string;

  @Column({ name: 'name', type: 'varchar' })
  name: string;

  @Column({ name: 'short_name', type: 'varchar' })
  shortName: string;

  @ManyToOne(() => Institute)
  @JoinColumn({ name: 'institute_id' })
  institute: Institute;

  @OneToMany(() => Group, (group) => group.speciality)
  groups: Group[];
}
