import { MigrationInterface, QueryRunner } from 'typeorm';

export class createUpdateUser1616889421607 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
        CREATE OR REPLACE FUNCTION update_user()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW."updatedAt" = NOW();
            RETURN NEW;
        END;
        $$ LANGUAGE 'plpgsql'
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
      DROP FUNCTION IF EXISTS update_user();
    `);
  }
}
