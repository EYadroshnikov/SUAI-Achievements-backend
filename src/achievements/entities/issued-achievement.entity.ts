import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Achievement } from './achievement.entity';

@Entity('issued-achievements')
export class IssuedAchievement {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ManyToOne(() => Achievement, (achievement) => achievement.issuedAchievements)
  achievement: Achievement;
}
