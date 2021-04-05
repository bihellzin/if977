import { MigrationInterface, QueryRunner } from 'typeorm';

export class createFinishMatch1616888909961 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
        CREATE OR REPLACE FUNCTION finish_match()
        RETURNS TRIGGER AS $$
        BEGIN
            UPDATE matches SET "finishedAt" = NOW()
                WHERE "roomCode" = NEW."roomCode" AND "finishedAt" IS NULL;
            UPDATE goals SET "finishedAt" = NOW()
                WHERE "matchRoomCode" = NEW."roomCode" AND "finishedAt" IS NULL;
            IF (SELECT EXISTS (SELECT "round" FROM matches WHERE "roomCode" = NEW."roomCode" LIMIT 1)) THEN
                NEW."round" := (SELECT MAX("round") + 1 FROM matches
                    WHERE "roomCode" = NEW."roomCode" LIMIT 1);
            END IF;
            RETURN NEW;
        END;
        $$ LANGUAGE 'plpgsql'
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
        DROP FUNCTION IF EXISTS finish_match();
      `);
  }
}
