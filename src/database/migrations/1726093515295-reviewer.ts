import { MigrationInterface, QueryRunner } from "typeorm";

export class Reviewer1726093515295 implements MigrationInterface {
    name = 'Reviewer1726093515295'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "applications" ADD "reviewer_uuid" uuid`);
        await queryRunner.query(`ALTER TABLE "applications" ADD CONSTRAINT "FK_6195be1f23332f685dec0489272" FOREIGN KEY ("reviewer_uuid") REFERENCES "users"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "applications" DROP CONSTRAINT "FK_6195be1f23332f685dec0489272"`);
        await queryRunner.query(`ALTER TABLE "applications" DROP COLUMN "reviewer_uuid"`);
    }

}
