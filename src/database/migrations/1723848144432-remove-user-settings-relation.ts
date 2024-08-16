import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveUserSettingsRelation1723848144432
  implements MigrationInterface
{
  name = 'RemoveUserSettingsRelation1723848144432';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_settings" DROP CONSTRAINT "FK_260836d0d0b24533033d3607b9d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_settings" DROP CONSTRAINT "REL_260836d0d0b24533033d3607b9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_settings" DROP COLUMN "user_uuid"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_settings" ADD "user_uuid" uuid`);
    await queryRunner.query(
      `ALTER TABLE "user_settings" ADD CONSTRAINT "REL_260836d0d0b24533033d3607b9" UNIQUE ("user_uuid")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_settings" ADD CONSTRAINT "FK_260836d0d0b24533033d3607b9d" FOREIGN KEY ("user_uuid") REFERENCES "users"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
