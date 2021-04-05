import { MigrationInterface, QueryRunner } from 'typeorm';

export class createUsers1616865068837 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
      CREATE TABLE IF NOT EXISTS users (
        "id" UUID DEFAULT uuid_generate_v4() NOT NULL UNIQUE,
        "name" VARCHAR(255) NOT NULL,
        "userType" INTEGER DEFAULT 0,
        "email" VARCHAR(255),
        "password" VARCHAR(255),
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP,
        PRIMARY KEY ("id")
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query('DROP TABLE IF EXISTS users CASCADE;');
  }
}
