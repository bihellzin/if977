import { MigrationInterface, QueryRunner } from 'typeorm';

export class createUpdateGoal1616889706283 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
        CREATE OR REPLACE FUNCTION update_music()
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
      DROP FUNCTION IF EXISTS update_music();
    `);
  }
}
