import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSocialPassport1722934390626 implements MigrationInterface {
  name = 'AddSocialPassport1722934390626';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."social_passport_education_type_enum" AS ENUM('BUDGET', 'CONTRACT')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."social_passport_bsk_status_enum" AS ENUM('NO', 'GOOGLE_FROM', 'RECEIVED')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."social_passport_student_id_status_enum" AS ENUM('NO', 'MANUFACTURED', 'RECEIVED')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."social_passport_profcom_card_status_enum" AS ENUM('NO', 'MANUFACTURED', 'RECEIVED')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."social_passport_scholarship_card_status_enum" AS ENUM('NO', 'MANUFACTURED', 'RECEIVED')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."social_passport_group_role_enum" AS ENUM('LEADER', 'DEPUTY_LEADER', 'PROF_ORG', 'STUDENT')`,
    );
    await queryRunner.query(`CREATE TABLE "social_passport"
                             (
                                 "uuid"                     uuid                                                    NOT NULL DEFAULT uuid_generate_v4(),
                                 "phone"                    character varying,
                                 "education_type"           "public"."social_passport_education_type_enum",
                                 "region"                   character varying,
                                 "social_category"          character varying,
                                 "bsk_status"               "public"."social_passport_bsk_status_enum"              NOT NULL DEFAULT 'NO',
                                 "medical_registration"     boolean                                                 NOT NULL DEFAULT false,
                                 "military_registration"    boolean,
                                 "pass_status"              boolean                                                 NOT NULL DEFAULT false,
                                 "student_id_status"        "public"."social_passport_student_id_status_enum"       NOT NULL DEFAULT 'NO',
                                 "preferential travel card" boolean                                                 NOT NULL,
                                 "profcom_application"      boolean                                                 NOT NULL DEFAULT false,
                                 "profcom_card_status"      "public"."social_passport_profcom_card_status_enum"     NOT NULL DEFAULT 'NO',
                                 "scholarship_card_status"  "public"."social_passport_scholarship_card_status_enum" NOT NULL DEFAULT 'NO',
                                 "certificate_or_contract"  boolean                                                 NOT NULL DEFAULT false,
                                 "competence_center_test"   boolean                                                 NOT NULL DEFAULT false,
                                 "group_role"               "public"."social_passport_group_role_enum"              NOT NULL DEFAULT 'STUDENT',
                                 "hobby"                    character varying,
                                 "student_government"       character varying,
                                 "hard_skills"              character varying,
                                 "created_at"               TIMESTAMP                                               NOT NULL DEFAULT now(),
                                 "updated_at"               TIMESTAMP                                               NOT NULL DEFAULT now(),
                                 "user_uuid"                uuid,
                                 CONSTRAINT "REL_bc1e9c9fb64a60e4700361e06c" UNIQUE ("user_uuid"),
                                 CONSTRAINT "PK_714072b229d283782cc73860ec0" PRIMARY KEY ("uuid")
                             )`);
    await queryRunner.query(`ALTER TABLE "social_passport"
        ADD CONSTRAINT "FK_bc1e9c9fb64a60e4700361e06c5" FOREIGN KEY ("user_uuid") REFERENCES "users" ("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "social_passport"
        DROP CONSTRAINT "FK_bc1e9c9fb64a60e4700361e06c5"`);
    await queryRunner.query(`DROP TABLE "social_passport"`);
    await queryRunner.query(
      `DROP TYPE "public"."social_passport_group_role_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."social_passport_scholarship_card_status_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."social_passport_profcom_card_status_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."social_passport_student_id_status_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."social_passport_bsk_status_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."social_passport_education_type_enum"`,
    );
  }
}
