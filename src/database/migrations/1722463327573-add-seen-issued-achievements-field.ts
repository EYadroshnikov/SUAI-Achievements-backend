import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSeenIssuedAchievementsField1722463327573 implements MigrationInterface {
    name = 'AddSeenIssuedAchievementsField1722463327573'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "issued_achievements" ADD "seen" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "issued_achievements" DROP COLUMN "seen"`);
    }

}
