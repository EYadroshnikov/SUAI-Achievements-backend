import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserSettings1723257414099 implements MigrationInterface {
  name = 'AddUserSettings1723257414099';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "user_settings"
                             (
                                 "uuid"              uuid      NOT NULL DEFAULT uuid_generate_v4(),
                                 "is_visible_in_top" boolean   NOT NULL DEFAULT true,
                                 "created_at"        TIMESTAMP NOT NULL DEFAULT now(),
                                 "updated_at"        TIMESTAMP NOT NULL DEFAULT now(),
                                 "user_uuid"         uuid,
                                 CONSTRAINT "REL_260836d0d0b24533033d3607b9" UNIQUE ("user_uuid"),
                                 CONSTRAINT "PK_a293a4a27ec37370f849576673c" PRIMARY KEY ("uuid")
                             )`);
    await queryRunner.query(`ALTER TABLE "user_settings"
        ADD CONSTRAINT "FK_260836d0d0b24533033d3607b9d" FOREIGN KEY ("user_uuid") REFERENCES "users" ("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_settings"
        DROP CONSTRAINT "FK_260836d0d0b24533033d3607b9d"`);
    await queryRunner.query(`DROP TABLE "user_settings"`);
  }
}
