import { MigrationInterface, QueryRunner } from 'typeorm';
import { Genre } from './../../models/genre.model';

export class insertGenres1619183366965 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(Genre)
      .values([
        { id: 1, name: 'Pop' },
        { id: 2, name: 'Sertanejo' },
        { id: 3, name: 'Brasileiras' },
      ])
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.clearTable('genre');
  }
}
