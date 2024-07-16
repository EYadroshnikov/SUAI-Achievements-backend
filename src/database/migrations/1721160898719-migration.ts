import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1721160898719 implements MigrationInterface {
  name = 'Migration1721160898719';

  public async up(queryRunner: QueryRunner): Promise<void> {
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
           "uuid"                uuid      NOT NULL DEFAULT uuid_generate_v4(),
           "reward"              integer   NOT NULL,
           "is_canceled"         boolean   NOT NULL,
           "cancellation_reason" character varying,
           "created_at"          TIMESTAMP NOT NULL DEFAULT now(),
           "updated_at"          TIMESTAMP NOT NULL DEFAULT now(),
           "achievement_uuid"    uuid,
           "issuer_uuid"         uuid,
           "student_uuid"        uuid,
           "canceler_uuid"       uuid,
           CONSTRAINT "UQ_d4514a6801b413741bc3868a809" UNIQUE ("student_uuid", "achievement_uuid"),
           CONSTRAINT "PK_1da046fab62a3d978c507961e1a" PRIMARY KEY ("uuid")
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
           "role"         "public"."users_role_enum" NOT NULL,
           "first_name"   character varying          NOT NULL,
           "last_name"    character varying          NOT NULL,
           "patronymic"   character varying,
           "balance"      integer                    NOT NULL DEFAULT '0',
           "is_banned"    boolean                    NOT NULL DEFAULT false,
           "created_at"   TIMESTAMP                  NOT NULL DEFAULT now(),
           "updated_at"   TIMESTAMP                  NOT NULL DEFAULT now(),
           "institute_id" integer,
           "group_id"     integer,
           CONSTRAINT "UQ_233f440ff87f5926e15492cc402" UNIQUE ("vk_id"),
           CONSTRAINT "PK_951b8f1dfc94ac1d0301a14b7e1" PRIMARY KEY ("uuid")
       )`,
    );
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
      `CREATE TABLE "institutes"
       (
           "id"         SERIAL            NOT NULL,
           "name"       character varying NOT NULL,
           "short_name" character varying,
           "number"     integer,
           CONSTRAINT "PK_96d2373e91ae5841128f8eb3b42" PRIMARY KEY ("id")
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
      `ALTER TABLE "issued_achievements"
          ADD CONSTRAINT "FK_6d136b2905e20b1f49538b3b67f" FOREIGN KEY ("canceler_uuid") REFERENCES "users" ("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE "users"
          DROP CONSTRAINT "FK_b8d62b3714f81341caa13ab0ff0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users"
          DROP CONSTRAINT "FK_d11afe6995bfdb198cb9ee0dde2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "issued_achievements"
          DROP CONSTRAINT "FK_6d136b2905e20b1f49538b3b67f"`,
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
      `DROP INDEX "public"."IDX_8c8fa2f234bc8cc280401bde20"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8d6f11cdfa13e0ae12337946de"`,
    );
    await queryRunner.query(`DROP TABLE "sputnik_groups"`);
    await queryRunner.query(`DROP TABLE "institutes"`);
    await queryRunner.query(`DROP TABLE "groups"`);
    await queryRunner.query(`DROP TABLE "specialties"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    await queryRunner.query(`DROP TABLE "issued_achievements"`);
    await queryRunner.query(`DROP TABLE "achievements"`);
    await queryRunner.query(`DROP TYPE "public"."achievements_rarity_enum"`);
    await queryRunner.query(`DROP TYPE "public"."achievements_category_enum"`);
    await queryRunner.query(`DROP TYPE "public"."achievements_type_enum"`);
  }
}
