import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Group } from '../../groups/entities/group.entity';

@Entity('institutes')
export class Institute {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', type: 'varchar' })
  name: string;

  @Column({ name: 'short_name', type: 'varchar' })
  shortName: string;

  @OneToMany(() => User, (user) => user.institute)
  users: User[];

  @OneToMany(() => Group, (group) => group.institute)
  groups: Group[];
}
