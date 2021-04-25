import { MigrationInterface, QueryRunner } from 'typeorm';
import { Podium } from '../../models/podium.model';

export class insertPodium1619280692043 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(Podium)
      .values([
        {
          id: 1,
          score: 9,
        },
        {
          id: 2,
          score: 8,
        },
        {
          id: 3,
          score: 7,
        },
        {
          id: 4,
          score: 6,
        },
      ])
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.clearTable('podium');
  }
}
