import { MigrationInterface, QueryRunner } from 'typeorm';

export class createFinishGoal1616889156456 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
        CREATE OR REPLACE FUNCTION finish_goal()
        RETURNS TRIGGER AS $$
        BEGIN
            UPDATE goals SET "finishedAt" = NOW()
                WHERE "matchRoomCode" = NEW."matchRoomCode" AND "matchRound" <= NEW."matchRound" AND "finishedAt" IS NULL;
            RETURN NEW;
        END;
        $$ LANGUAGE 'plpgsql'
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
      DROP FUNCTION IF EXISTS finish_goal();
    `);
  }
}
