import { MigrationInterface, QueryRunner } from 'typeorm';

export class createMusics1616865085647 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
      CREATE TABLE IF NOT EXISTS musics (
        "url" VARCHAR(255) NOT NULL UNIQUE,
        "name" VARCHAR,
        "author" VARCHAR,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP,
        PRIMARY KEY ("url")
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`DROP TABLE IF EXISTS musics CASCADE;`);
  }
}
