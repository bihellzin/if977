import { MigrationInterface, QueryRunner } from 'typeorm';

export class createTriggerFinishMatch1616889073562
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
        CREATE TRIGGER trigger_insert_new_match
        BEFORE INSERT ON matches
        FOR EACH ROW EXECUTE PROCEDURE finish_match();
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
      DROP TRIGGER IF EXISTS trigger_insert_new_match ON matches;
    `);
  }
}
