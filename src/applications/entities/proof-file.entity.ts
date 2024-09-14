import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Application } from './application.entity';

@Entity('proof_files')
export class ProofFile {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ManyToOne(() => Application, (application) => application.proofFiles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'application_uuid' })
  application: Application;

  @Column({ name: 'type', type: 'varchar', nullable: true })
  type: string;

  @Column({ name: 'mimetype', type: 'varchar', nullable: true })
  mimetype: string;

  @Column({ name: 'size', type: 'integer', nullable: true })
  size: number;

  @Column({ name: 'originalname', type: 'varchar', nullable: true })
  originalname: string;

  @Column({ name: 'file_name', type: 'varchar' })
  fileName: string;
}
