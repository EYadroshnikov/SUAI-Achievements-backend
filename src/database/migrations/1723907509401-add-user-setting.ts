import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserSetting1723907509401 implements MigrationInterface {
    name = 'AddUserSetting1723907509401'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_settings" DROP CONSTRAINT "FK_260836d0d0b24533033d3607b9d"`);
        await queryRunner.query(`ALTER TABLE "user_settings" ADD "show_unseen_achievements" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "user_settings" ADD CONSTRAINT "FK_260836d0d0b24533033d3607b9d" FOREIGN KEY ("user_uuid") REFERENCES "users"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_settings" DROP CONSTRAINT "FK_260836d0d0b24533033d3607b9d"`);
        await queryRunner.query(`ALTER TABLE "user_settings" DROP COLUMN "show_unseen_achievements"`);
        await queryRunner.query(`ALTER TABLE "user_settings" ADD CONSTRAINT "FK_260836d0d0b24533033d3607b9d" FOREIGN KEY ("user_uuid") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
