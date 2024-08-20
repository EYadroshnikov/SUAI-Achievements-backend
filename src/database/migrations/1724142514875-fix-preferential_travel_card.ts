import { MigrationInterface, QueryRunner } from "typeorm";

export class FixPreferentialTravelCard1724142514875 implements MigrationInterface {
    name = 'FixPreferentialTravelCard1724142514875'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "social_passport" RENAME COLUMN "preferential travel card" TO "preferential_travel_card"`);
        await queryRunner.query(`ALTER TABLE "social_passport" ALTER COLUMN "preferential_travel_card" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "social_passport" ALTER COLUMN "preferential_travel_card" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "social_passport" RENAME COLUMN "preferential_travel_card" TO "preferential travel card"`);
    }

}
