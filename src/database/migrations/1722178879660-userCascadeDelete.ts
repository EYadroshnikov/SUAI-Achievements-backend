import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserCascadeDelete1722178879660 implements MigrationInterface {
  name = 'UserCascadeDelete1722178879660';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "issued_achievements"
          DROP CONSTRAINT "FK_6ecf86aca34e5d118950d94927b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "issued_achievements"
          DROP CONSTRAINT "FK_abefddf3ce88f85f7dd0e4d88eb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "achievement_operations"
          DROP CONSTRAINT "FK_9877cc9d01828bf66fb8fa6a655"`,
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
          ADD CONSTRAINT "FK_9877cc9d01828bf66fb8fa6a655" FOREIGN KEY ("student_uuid") REFERENCES "users" ("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "achievement_operations"
          DROP CONSTRAINT "FK_9877cc9d01828bf66fb8fa6a655"`,
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
      `ALTER TABLE "achievement_operations"
          ADD CONSTRAINT "FK_9877cc9d01828bf66fb8fa6a655" FOREIGN KEY ("student_uuid") REFERENCES "users" ("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "issued_achievements"
          ADD CONSTRAINT "FK_abefddf3ce88f85f7dd0e4d88eb" FOREIGN KEY ("student_uuid") REFERENCES "users" ("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "issued_achievements"
          ADD CONSTRAINT "FK_6ecf86aca34e5d118950d94927b" FOREIGN KEY ("issuer_uuid") REFERENCES "users" ("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
