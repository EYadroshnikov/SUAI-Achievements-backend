import { MigrationInterface, QueryRunner } from 'typeorm';

export class NotificationUserSettings1723839638073
  implements MigrationInterface
{
  name = 'NotificationUserSettings1723839638073';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_settings" ADD "receive_tg_achievement_notification" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_settings" ADD "receive_vk_achievement_notification" boolean NOT NULL DEFAULT true`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_settings" DROP COLUMN "receive_vk_achievement_notification"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_settings" DROP COLUMN "receive_tg_achievement_notification"`,
    );
  }
}
