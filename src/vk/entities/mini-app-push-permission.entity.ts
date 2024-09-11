import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('mini_app_push_permission')
export class MiniAppPushPermission {
  @PrimaryColumn({ name: 'vk_id' })
  vkId: string;

  @Column({ name: 'is_allowed', type: 'boolean' })
  isAllowed: boolean;
}
