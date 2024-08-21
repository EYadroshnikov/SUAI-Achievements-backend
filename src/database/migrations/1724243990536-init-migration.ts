import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitMigration1724243990536 implements MigrationInterface {
  name = 'InitMigration1724243990536';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "specialties"
       (
           "id"           SERIAL            NOT NULL,
           "code"         character varying NOT NULL,
           "name"         character varying NOT NULL,
           "short_name"   character varying NOT NULL,
           "institute_id" integer,
           CONSTRAINT "PK_ba01cec5aa8ac48778a1d097e98" PRIMARY KEY ("id")
       )`,
    );
    await queryRunner.query(
      `CREATE TABLE "institutes"
       (
           "id"              SERIAL            NOT NULL,
           "name"            character varying NOT NULL,
           "short_name"      character varying,
           "number"          integer,
           "spread_sheet_id" character varying,
           CONSTRAINT "PK_96d2373e91ae5841128f8eb3b42" PRIMARY KEY ("id")
       )`,
    );
    await queryRunner.query(
      `CREATE TABLE "groups"
       (
           "id"            SERIAL            NOT NULL,
           "name"          character varying NOT NULL,
           "created_at"    TIMESTAMP         NOT NULL DEFAULT now(),
           "updated_at"    TIMESTAMP         NOT NULL DEFAULT now(),
           "institute_id"  integer,
           "speciality_id" integer,
           CONSTRAINT "UQ_664ea405ae2a10c264d582ee563" UNIQUE ("name"),
           CONSTRAINT "PK_659d1483316afb28afd3a90646e" PRIMARY KEY ("id")
       )`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."achievements_type_enum" AS ENUM('OPENED', 'HINTED', 'HIDDEN')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."achievements_category_enum" AS ENUM('PERSONAL', 'GROUP', 'URBAN', 'UNIVERSITY', 'EDUCATIONAL')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."achievements_rarity_enum" AS ENUM('RARE', 'COMMON', 'EPIC', 'LEGENDARY', 'HEROIC')`,
    );
    await queryRunner.query(
      `CREATE TABLE "achievements"
       (
           "uuid"                uuid                                  NOT NULL DEFAULT uuid_generate_v4(),
           "name"                character varying                     NOT NULL,
           "type"                "public"."achievements_type_enum"     NOT NULL,
           "category"            "public"."achievements_category_enum" NOT NULL,
           "rarity"              "public"."achievements_rarity_enum"   NOT NULL,
           "reward"              integer                               NOT NULL,
           "hidden_icon_path"    character varying                     NOT NULL,
           "opened_icon_path"    character varying                     NOT NULL,
           "sputnik_requirement" character varying                     NOT NULL,
           "student_requirement" character varying                     NOT NULL,
           "hint"                character varying,
           "rofl_description"    character varying,
           CONSTRAINT "PK_14aa3957e14bd426f7ab3744a2d" PRIMARY KEY ("uuid")
       )`,
    );
    await queryRunner.query(
      `CREATE TABLE "issued_achievements"
       (
           "uuid"             uuid      NOT NULL DEFAULT uuid_generate_v4(),
           "reward"           integer   NOT NULL,
           "seen"             boolean   NOT NULL DEFAULT false,
           "created_at"       TIMESTAMP NOT NULL DEFAULT now(),
           "updated_at"       TIMESTAMP NOT NULL DEFAULT now(),
           "achievement_uuid" uuid,
           "issuer_uuid"      uuid,
           "student_uuid"     uuid,
           CONSTRAINT "UQ_d4514a6801b413741bc3868a809" UNIQUE ("student_uuid", "achievement_uuid"),
           CONSTRAINT "PK_1da046fab62a3d978c507961e1a" PRIMARY KEY ("uuid")
       )`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."achievement_operations_type_enum" AS ENUM('ISSUE', 'CANCEL')`,
    );
    await queryRunner.query(
      `CREATE TABLE "achievement_operations"
       (
           "uuid"                uuid                                        NOT NULL DEFAULT uuid_generate_v4(),
           "type"                "public"."achievement_operations_type_enum" NOT NULL,
           "cancellation_reason" character varying,
           "created_at"          TIMESTAMP                                   NOT NULL DEFAULT now(),
           "updated_at"          TIMESTAMP                                   NOT NULL DEFAULT now(),
           "achievement_uuid"    uuid,
           "executor_uuid"       uuid,
           "student_uuid"        uuid,
           CONSTRAINT "PK_d1675f58b292a4f234258c329ec" PRIMARY KEY ("uuid")
       )`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."social_passport_sex_enum" AS ENUM('MALE', 'FEMALE')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."social_passport_previous_education_enum" AS ENUM('SCHOOL', 'COLLEGE', 'UNIVERSITY')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."social_passport_education_type_enum" AS ENUM('BUDGET', 'CONTRACT', 'SLAVISH')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."social_passport_bsk_status_enum" AS ENUM('NO', 'GOOGLE_FROM', 'WAITING', 'RECEIVED')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."social_passport_medical_registration_enum" AS ENUM('NOT_REQUIRED', 'NOT_STARTED', 'NOT_ENOUGH_DOCS', 'FINISHED')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."social_passport_military_registration_enum" AS ENUM('NOT_REQUIRED', 'NOT_STARTED', 'NOT_ENOUGH_DOCS', 'FINISHED')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."social_passport_student_id_status_enum" AS ENUM('NO', 'PHOTO_PROVIDED', 'RECEIVED')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."social_passport_profcom_card_status_enum" AS ENUM('NO', 'PHOTO_PROVIDED', 'RECEIVED')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."social_passport_group_role_enum" AS ENUM('LEADER', 'DEPUTY_LEADER', 'PROF_ORG', 'STUDENT')`,
    );
    await queryRunner.query(
      `CREATE TABLE "social_passport"
       (
           "uuid"                     uuid                                                 NOT NULL DEFAULT uuid_generate_v4(),
           "sex"                      "public"."social_passport_sex_enum"                  NOT NULL,
           "birthday"                 date                                                 NOT NULL,
           "phone"                    character varying                                    NOT NULL,
           "email"                    character varying                                    NOT NULL,
           "is_foreign"               boolean                                              NOT NULL,
           "previous_education"       "public"."social_passport_previous_education_enum"   NOT NULL,
           "sso_access"               boolean                                              NOT NULL DEFAULT false,
           "competitive_score"        integer                                              NOT NULL,
           "education_type"           "public"."social_passport_education_type_enum"       NOT NULL,
           "region"                   character varying                                    NOT NULL,
           "social_category"          character varying,
           "bsk_status"               "public"."social_passport_bsk_status_enum"           NOT NULL DEFAULT 'NO',
           "medical_registration"     "public"."social_passport_medical_registration_enum" NOT NULL DEFAULT 'NOT_STARTED',
           "military_registration"    "public"."social_passport_military_registration_enum",
           "dormitory"                boolean                                                       DEFAULT false,
           "pass_status"              boolean                                              NOT NULL DEFAULT false,
           "student_id_status"        "public"."social_passport_student_id_status_enum"    NOT NULL DEFAULT 'NO',
           "preferential_travel_card" boolean,
           "profcom_application"      boolean                                                       DEFAULT false,
           "profcom_card_status"      "public"."social_passport_profcom_card_status_enum"  NOT NULL DEFAULT 'NO',
           "scholarship_card_status"  boolean                                                       DEFAULT false,
           "competence_center_test"   boolean                                              NOT NULL DEFAULT false,
           "group_role"               "public"."social_passport_group_role_enum"           NOT NULL DEFAULT 'STUDENT',
           "hobby"                    character varying,
           "studios"                  character varying,
           "hard_skills"              character varying,
           "created_at"               TIMESTAMP                                            NOT NULL DEFAULT now(),
           "updated_at"               TIMESTAMP                                            NOT NULL DEFAULT now(),
           "user_uuid"                uuid,
           CONSTRAINT "REL_bc1e9c9fb64a60e4700361e06c" UNIQUE ("user_uuid"),
           CONSTRAINT "PK_714072b229d283782cc73860ec0" PRIMARY KEY ("uuid")
       )`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_settings"
       (
           "uuid"                                uuid      NOT NULL DEFAULT uuid_generate_v4(),
           "is_visible_in_top"                   boolean   NOT NULL DEFAULT true,
           "show_unseen_achievements"            boolean   NOT NULL DEFAULT true,
           "receive_tg_achievement_notification" boolean   NOT NULL DEFAULT true,
           "receive_vk_achievement_notification" boolean   NOT NULL DEFAULT true,
           "created_at"                          TIMESTAMP NOT NULL DEFAULT now(),
           "updated_at"                          TIMESTAMP NOT NULL DEFAULT now(),
           "user_uuid"                           uuid,
           CONSTRAINT "REL_260836d0d0b24533033d3607b9" UNIQUE ("user_uuid"),
           CONSTRAINT "PK_a293a4a27ec37370f849576673c" PRIMARY KEY ("uuid")
       )`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('ADMIN', 'CURATOR', 'SPUTNIK', 'STUDENT')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users"
       (
           "uuid"         uuid                       NOT NULL DEFAULT uuid_generate_v4(),
           "vk_id"        character varying          NOT NULL,
           "tg_id"        character varying,
           "tg_username"  character varying,
           "role"         "public"."users_role_enum" NOT NULL,
           "first_name"   character varying          NOT NULL,
           "last_name"    character varying          NOT NULL,
           "patronymic"   character varying,
           "balance"      integer                    NOT NULL DEFAULT '0',
           "is_banned"    boolean                    NOT NULL DEFAULT false,
           "avatar"       character varying,
           "created_at"   TIMESTAMP                  NOT NULL DEFAULT now(),
           "updated_at"   TIMESTAMP                  NOT NULL DEFAULT now(),
           "institute_id" integer,
           "group_id"     integer,
           CONSTRAINT "UQ_233f440ff87f5926e15492cc402" UNIQUE ("vk_id"),
           CONSTRAINT "UQ_9793d2defd72fffdb9a55c0d88f" UNIQUE ("tg_id"),
           CONSTRAINT "UQ_7f0dc4e5790dd2834fe98c38495" UNIQUE ("tg_username"),
           CONSTRAINT "PK_951b8f1dfc94ac1d0301a14b7e1" PRIMARY KEY ("uuid")
       )`,
    );
    await queryRunner.query(
      `CREATE TABLE "refresh_sessions"
       (
           "id"            SERIAL            NOT NULL,
           "refresh_token" uuid              NOT NULL DEFAULT uuid_generate_v4(),
           "user_agent"    character varying NOT NULL,
           "fingerprint"   character varying NOT NULL,
           "ip"            character varying NOT NULL,
           "expires_at"    TIMESTAMP         NOT NULL,
           "created_at"    TIMESTAMP         NOT NULL DEFAULT now(),
           "user_uuid"     uuid,
           CONSTRAINT "PK_9190032f6967b7971dca07d69f3" PRIMARY KEY ("id")
       )`,
    );
    await queryRunner.query(
      `CREATE TABLE "sputnik_groups"
       (
           "group_id"  integer NOT NULL,
           "user_uuid" uuid    NOT NULL,
           CONSTRAINT "PK_85d7988a41cfa05182c99f3a8b4" PRIMARY KEY ("group_id", "user_uuid")
       )`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8d6f11cdfa13e0ae12337946de" ON "sputnik_groups" ("group_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8c8fa2f234bc8cc280401bde20" ON "sputnik_groups" ("user_uuid") `,
    );
    await queryRunner.query(
      `ALTER TABLE "specialties"
          ADD CONSTRAINT "FK_93b904dbb55085ef6623b66b50f" FOREIGN KEY ("institute_id") REFERENCES "institutes" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "groups"
          ADD CONSTRAINT "FK_886ad24a7f09bdeb7fd7c7707ba" FOREIGN KEY ("institute_id") REFERENCES "institutes" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "groups"
          ADD CONSTRAINT "FK_48144a846fff5b9b25b8725a7e0" FOREIGN KEY ("speciality_id") REFERENCES "specialties" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "issued_achievements"
          ADD CONSTRAINT "FK_77a196e57fe4dd86a525d3d1955" FOREIGN KEY ("achievement_uuid") REFERENCES "achievements" ("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "issued_achievements"
          ADD CONSTRAINT "FK_6ecf86aca34e5d118950d94927b" FOREIGN KEY ("issuer_uuid") REFERENCES "users" ("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "issued_achievements"
          ADD CONSTRAINT "FK_abefddf3ce88f85f7dd0e4d88eb" FOREIGN KEY ("student_uuid") REFERENCES "users" ("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "achievement_operations"
          ADD CONSTRAINT "FK_c7c46d3c50467badcf3e8756c9e" FOREIGN KEY ("achievement_uuid") REFERENCES "achievements" ("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "achievement_operations"
          ADD CONSTRAINT "FK_a6413223da37db5e1a38282eed1" FOREIGN KEY ("executor_uuid") REFERENCES "users" ("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "achievement_operations"
          ADD CONSTRAINT "FK_9877cc9d01828bf66fb8fa6a655" FOREIGN KEY ("student_uuid") REFERENCES "users" ("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "social_passport"
          ADD CONSTRAINT "FK_bc1e9c9fb64a60e4700361e06c5" FOREIGN KEY ("user_uuid") REFERENCES "users" ("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_settings"
          ADD CONSTRAINT "FK_260836d0d0b24533033d3607b9d" FOREIGN KEY ("user_uuid") REFERENCES "users" ("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users"
          ADD CONSTRAINT "FK_d11afe6995bfdb198cb9ee0dde2" FOREIGN KEY ("institute_id") REFERENCES "institutes" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users"
          ADD CONSTRAINT "FK_b8d62b3714f81341caa13ab0ff0" FOREIGN KEY ("group_id") REFERENCES "groups" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_sessions"
          ADD CONSTRAINT "FK_3f3d0a296092e6892fed9d39388" FOREIGN KEY ("user_uuid") REFERENCES "users" ("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sputnik_groups"
          ADD CONSTRAINT "FK_8d6f11cdfa13e0ae12337946ded" FOREIGN KEY ("group_id") REFERENCES "groups" ("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "sputnik_groups"
          ADD CONSTRAINT "FK_8c8fa2f234bc8cc280401bde200" FOREIGN KEY ("user_uuid") REFERENCES "users" ("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sputnik_groups"
          DROP CONSTRAINT "FK_8c8fa2f234bc8cc280401bde200"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sputnik_groups"
          DROP CONSTRAINT "FK_8d6f11cdfa13e0ae12337946ded"`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_sessions"
          DROP CONSTRAINT "FK_3f3d0a296092e6892fed9d39388"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users"
          DROP CONSTRAINT "FK_b8d62b3714f81341caa13ab0ff0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users"
          DROP CONSTRAINT "FK_d11afe6995bfdb198cb9ee0dde2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_settings"
          DROP CONSTRAINT "FK_260836d0d0b24533033d3607b9d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "social_passport"
          DROP CONSTRAINT "FK_bc1e9c9fb64a60e4700361e06c5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "achievement_operations"
          DROP CONSTRAINT "FK_9877cc9d01828bf66fb8fa6a655"`,
    );
    await queryRunner.query(
      `ALTER TABLE "achievement_operations"
          DROP CONSTRAINT "FK_a6413223da37db5e1a38282eed1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "achievement_operations"
          DROP CONSTRAINT "FK_c7c46d3c50467badcf3e8756c9e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "issued_achievements"
          DROP CONSTRAINT "FK_abefddf3ce88f85f7dd0e4d88eb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "issued_achievements"
          DROP CONSTRAINT "FK_6ecf86aca34e5d118950d94927b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "issued_achievements"
          DROP CONSTRAINT "FK_77a196e57fe4dd86a525d3d1955"`,
    );
    await queryRunner.query(
      `ALTER TABLE "groups"
          DROP CONSTRAINT "FK_48144a846fff5b9b25b8725a7e0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "groups"
          DROP CONSTRAINT "FK_886ad24a7f09bdeb7fd7c7707ba"`,
    );
    await queryRunner.query(
      `ALTER TABLE "specialties"
          DROP CONSTRAINT "FK_93b904dbb55085ef6623b66b50f"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8c8fa2f234bc8cc280401bde20"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8d6f11cdfa13e0ae12337946de"`,
    );
    await queryRunner.query(`DROP TABLE "sputnik_groups"`);
    await queryRunner.query(`DROP TABLE "refresh_sessions"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    await queryRunner.query(`DROP TABLE "user_settings"`);
    await queryRunner.query(`DROP TABLE "social_passport"`);
    await queryRunner.query(
      `DROP TYPE "public"."social_passport_group_role_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."social_passport_profcom_card_status_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."social_passport_student_id_status_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."social_passport_military_registration_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."social_passport_medical_registration_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."social_passport_bsk_status_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."social_passport_education_type_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."social_passport_previous_education_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."social_passport_sex_enum"`);
    await queryRunner.query(`DROP TABLE "achievement_operations"`);
    await queryRunner.query(
      `DROP TYPE "public"."achievement_operations_type_enum"`,
    );
    await queryRunner.query(`DROP TABLE "issued_achievements"`);
    await queryRunner.query(`DROP TABLE "achievements"`);
    await queryRunner.query(`DROP TYPE "public"."achievements_rarity_enum"`);
    await queryRunner.query(`DROP TYPE "public"."achievements_category_enum"`);
    await queryRunner.query(`DROP TYPE "public"."achievements_type_enum"`);
    await queryRunner.query(`DROP TABLE "groups"`);
    await queryRunner.query(`DROP TABLE "institutes"`);
    await queryRunner.query(`DROP TABLE "specialties"`);
  }
}
