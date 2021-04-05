import { MigrationInterface, QueryRunner } from 'typeorm';

export class createTriggerFinishGoal1616889229755
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
        CREATE TRIGGER trigger_insert_new_match_goal
        BEFORE INSERT ON goals
        FOR EACH ROW EXECUTE PROCEDURE finish_goal();
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
      DROP TRIGGER IF EXISTS trigger_insert_new_match_goal ON goals;
      `);
  }
}
