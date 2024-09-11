import { MigrationInterface, QueryRunner } from 'typeorm';

export class MiniAppPushPermission1726014798453 implements MigrationInterface {
  name = 'MiniAppPushPermission1726014798453';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "mini_app_push_permission"
       (
           "vk_id"      character varying NOT NULL,
           "is_allowed" boolean           NOT NULL,
           CONSTRAINT "PK_1027d68504245ef493a7d72f5ce" PRIMARY KEY ("vk_id")
       )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "mini_app_push_permission"`);
  }
}
