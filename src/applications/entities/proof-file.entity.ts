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

  @ManyToOne(() => Application, (application) => application.proofFiles)
  @JoinColumn({ name: 'application_uuid' })
  application: Application;

  @Column({ name: 'type', type: 'varchar' })
  type: string;

  @Column({ name: 'mimetype', type: 'varchar' })
  mimetype: string;

  @Column({ name: 'size', type: 'integer' })
  size: number;

  @Column({ name: 'originalname', type: 'varchar' })
  originalname: string;

  @Column({ name: 'file_name', type: 'varchar' })
  fileName: string;
} //TODO: make nullable
