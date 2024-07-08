import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Group } from '../../groups/entities/group.entity';
import { Speciality } from '../../specialties/enities/speciality.entity';

@Entity('institutes')
export class Institute {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', type: 'varchar' })
  name: string;

  @Column({ name: 'short_name', type: 'varchar', nullable: true })
  shortName: string;

  @Column({ name: 'number', type: 'integer', nullable: true })
  number: number;

  @OneToMany(() => Group, (group) => group.institute)
  groups: Group[];

  @OneToMany(() => Speciality, (speciality) => speciality.institute)
  specialties: Speciality[];
}
