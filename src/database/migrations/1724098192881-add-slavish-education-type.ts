import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSlavishEducationType1724098192881 implements MigrationInterface {
    name = 'AddSlavishEducationType1724098192881'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."social_passport_education_type_enum" RENAME TO "social_passport_education_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."social_passport_education_type_enum" AS ENUM('BUDGET', 'CONTRACT', 'SLAVISH')`);
        await queryRunner.query(`ALTER TABLE "social_passport" ALTER COLUMN "education_type" TYPE "public"."social_passport_education_type_enum" USING "education_type"::"text"::"public"."social_passport_education_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."social_passport_education_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."social_passport_education_type_enum_old" AS ENUM('BUDGET', 'CONTRACT')`);
        await queryRunner.query(`ALTER TABLE "social_passport" ALTER COLUMN "education_type" TYPE "public"."social_passport_education_type_enum_old" USING "education_type"::"text"::"public"."social_passport_education_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."social_passport_education_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."social_passport_education_type_enum_old" RENAME TO "social_passport_education_type_enum"`);
    }

}
