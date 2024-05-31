import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
