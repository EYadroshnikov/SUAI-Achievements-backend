import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('telegram_message')
export class TelegramMessageEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ name: 'tg_user_id', type: 'varchar' })
  tgUserId: string;

  @Column({ name: 'message', type: 'varchar' })
  message: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
