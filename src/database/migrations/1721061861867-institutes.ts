import { MigrationInterface, QueryRunner } from 'typeorm';

export class Institutes1721061861867 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            INSERT INTO institutes (id, name, short_name, number)
            VALUES (1, 'Институт аэрокосмических приборов и систем', 'Институт 1', 1),
                   (2, 'Институт радиотехники и инфокоммуникационных технологий', 'Институт 2', 2),
                   (3, 'Институт киберфизических систем', 'Институт 3', 3),
                   (4, 'Институт информационных технологий и программирования', 'Институт 4', 4),
                   (5, 'Институт фундаментальной подготовки и технологических инноваций', 'Институт ФПТИ', 5),
                   (6, 'Гуманитарный факультет', 'Факультет 6', 6),
                   (7, 'Военный учебный центр', 'ВУЦ', 7),
                   (8, 'Институт технологий предпринимательства и права', 'Институт 8', 8),
                   (9, 'Факультет среднего профессионального образования', 'Факультет СПО', 12);
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DELETE
        FROM institutes
        WHERE id IN (1, 2, 3, 4, 5, 6, 7, 8, 9);
    `);
  }
}
