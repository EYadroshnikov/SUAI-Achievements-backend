import { MigrationInterface, QueryRunner } from "typeorm";

export class SocialPassportEdit1724188581117 implements MigrationInterface {
    name = 'SocialPassportEdit1724188581117'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "social_passport" DROP COLUMN "certificate_or_contract"`);
        await queryRunner.query(`ALTER TABLE "social_passport" DROP COLUMN "student_government"`);
        await queryRunner.query(`CREATE TYPE "public"."social_passport_sex_enum" AS ENUM('MALE', 'FEMALE')`);
        await queryRunner.query(`ALTER TABLE "social_passport" ADD "sex" "public"."social_passport_sex_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "social_passport" ADD "birthday" date NOT NULL`);
        await queryRunner.query(`ALTER TABLE "social_passport" ADD "email" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "social_passport" ADD "is_foreign" boolean NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."social_passport_previous_education_enum" AS ENUM('SCHOOL', 'COLLEGE', 'UNIVERSITY')`);
        await queryRunner.query(`ALTER TABLE "social_passport" ADD "previous_education" "public"."social_passport_previous_education_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "social_passport" ADD "sso_access" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "social_passport" ADD "competitive_score" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "social_passport" ADD "dormitory" boolean DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "social_passport" ADD "studios" character varying`);
        await queryRunner.query(`ALTER TABLE "social_passport" ALTER COLUMN "phone" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "social_passport" ALTER COLUMN "education_type" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "social_passport" ALTER COLUMN "region" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "social_passport" DROP COLUMN "medical_registration"`);
        await queryRunner.query(`CREATE TYPE "public"."social_passport_medical_registration_enum" AS ENUM('NOT_REQUIRED', 'NOT_STARTED', 'NOT_ENOUGH_DOCS', 'FINISHED')`);
        await queryRunner.query(`ALTER TABLE "social_passport" ADD "medical_registration" "public"."social_passport_medical_registration_enum" NOT NULL DEFAULT 'NOT_STARTED'`);
        await queryRunner.query(`ALTER TABLE "social_passport" DROP COLUMN "military_registration"`);
        await queryRunner.query(`CREATE TYPE "public"."social_passport_military_registration_enum" AS ENUM('NOT_REQUIRED', 'NOT_STARTED', 'NOT_ENOUGH_DOCS', 'FINISHED')`);
        await queryRunner.query(`ALTER TABLE "social_passport" ADD "military_registration" "public"."social_passport_military_registration_enum" NOT NULL DEFAULT 'NOT_REQUIRED'`);
        await queryRunner.query(`ALTER TYPE "public"."social_passport_student_id_status_enum" RENAME TO "social_passport_student_id_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."social_passport_student_id_status_enum" AS ENUM('NO', 'PHOTO_PROVIDED', 'RECEIVED')`);
        await queryRunner.query(`ALTER TABLE "social_passport" ALTER COLUMN "student_id_status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "social_passport" ALTER COLUMN "student_id_status" TYPE "public"."social_passport_student_id_status_enum" USING "student_id_status"::"text"::"public"."social_passport_student_id_status_enum"`);
        await queryRunner.query(`ALTER TABLE "social_passport" ALTER COLUMN "student_id_status" SET DEFAULT 'NO'`);
        await queryRunner.query(`DROP TYPE "public"."social_passport_student_id_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "social_passport" ALTER COLUMN "profcom_application" DROP NOT NULL`);
        await queryRunner.query(`ALTER TYPE "public"."social_passport_profcom_card_status_enum" RENAME TO "social_passport_profcom_card_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."social_passport_profcom_card_status_enum" AS ENUM('NO', 'PHOTO_PROVIDED', 'RECEIVED')`);
        await queryRunner.query(`ALTER TABLE "social_passport" ALTER COLUMN "profcom_card_status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "social_passport" ALTER COLUMN "profcom_card_status" TYPE "public"."social_passport_profcom_card_status_enum" USING "profcom_card_status"::"text"::"public"."social_passport_profcom_card_status_enum"`);
        await queryRunner.query(`ALTER TABLE "social_passport" ALTER COLUMN "profcom_card_status" SET DEFAULT 'NO'`);
        await queryRunner.query(`DROP TYPE "public"."social_passport_profcom_card_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "social_passport" DROP COLUMN "scholarship_card_status"`);
        await queryRunner.query(`DROP TYPE "public"."social_passport_scholarship_card_status_enum"`);
        await queryRunner.query(`ALTER TABLE "social_passport" ADD "scholarship_card_status" boolean DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "social_passport" DROP COLUMN "scholarship_card_status"`);
        await queryRunner.query(`CREATE TYPE "public"."social_passport_scholarship_card_status_enum" AS ENUM('NO', 'MANUFACTURED', 'RECEIVED')`);
        await queryRunner.query(`ALTER TABLE "social_passport" ADD "scholarship_card_status" "public"."social_passport_scholarship_card_status_enum" NOT NULL DEFAULT 'NO'`);
        await queryRunner.query(`CREATE TYPE "public"."social_passport_profcom_card_status_enum_old" AS ENUM('NO', 'MANUFACTURED', 'RECEIVED')`);
        await queryRunner.query(`ALTER TABLE "social_passport" ALTER COLUMN "profcom_card_status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "social_passport" ALTER COLUMN "profcom_card_status" TYPE "public"."social_passport_profcom_card_status_enum_old" USING "profcom_card_status"::"text"::"public"."social_passport_profcom_card_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "social_passport" ALTER COLUMN "profcom_card_status" SET DEFAULT 'NO'`);
        await queryRunner.query(`DROP TYPE "public"."social_passport_profcom_card_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."social_passport_profcom_card_status_enum_old" RENAME TO "social_passport_profcom_card_status_enum"`);
        await queryRunner.query(`ALTER TABLE "social_passport" ALTER COLUMN "profcom_application" SET NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."social_passport_student_id_status_enum_old" AS ENUM('NO', 'MANUFACTURED', 'RECEIVED')`);
        await queryRunner.query(`ALTER TABLE "social_passport" ALTER COLUMN "student_id_status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "social_passport" ALTER COLUMN "student_id_status" TYPE "public"."social_passport_student_id_status_enum_old" USING "student_id_status"::"text"::"public"."social_passport_student_id_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "social_passport" ALTER COLUMN "student_id_status" SET DEFAULT 'NO'`);
        await queryRunner.query(`DROP TYPE "public"."social_passport_student_id_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."social_passport_student_id_status_enum_old" RENAME TO "social_passport_student_id_status_enum"`);
        await queryRunner.query(`ALTER TABLE "social_passport" DROP COLUMN "military_registration"`);
        await queryRunner.query(`DROP TYPE "public"."social_passport_military_registration_enum"`);
        await queryRunner.query(`ALTER TABLE "social_passport" ADD "military_registration" boolean`);
        await queryRunner.query(`ALTER TABLE "social_passport" DROP COLUMN "medical_registration"`);
        await queryRunner.query(`DROP TYPE "public"."social_passport_medical_registration_enum"`);
        await queryRunner.query(`ALTER TABLE "social_passport" ADD "medical_registration" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "social_passport" ALTER COLUMN "region" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "social_passport" ALTER COLUMN "education_type" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "social_passport" ALTER COLUMN "phone" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "social_passport" DROP COLUMN "studios"`);
        await queryRunner.query(`ALTER TABLE "social_passport" DROP COLUMN "dormitory"`);
        await queryRunner.query(`ALTER TABLE "social_passport" DROP COLUMN "competitive_score"`);
        await queryRunner.query(`ALTER TABLE "social_passport" DROP COLUMN "sso_access"`);
        await queryRunner.query(`ALTER TABLE "social_passport" DROP COLUMN "previous_education"`);
        await queryRunner.query(`DROP TYPE "public"."social_passport_previous_education_enum"`);
        await queryRunner.query(`ALTER TABLE "social_passport" DROP COLUMN "is_foreign"`);
        await queryRunner.query(`ALTER TABLE "social_passport" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "social_passport" DROP COLUMN "birthday"`);
        await queryRunner.query(`ALTER TABLE "social_passport" DROP COLUMN "sex"`);
        await queryRunner.query(`DROP TYPE "public"."social_passport_sex_enum"`);
        await queryRunner.query(`ALTER TABLE "social_passport" ADD "student_government" character varying`);
        await queryRunner.query(`ALTER TABLE "social_passport" ADD "certificate_or_contract" boolean NOT NULL DEFAULT false`);
    }

}
