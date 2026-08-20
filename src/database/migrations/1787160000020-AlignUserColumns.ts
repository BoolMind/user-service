import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlignUserColumns1787160000020 implements MigrationInterface {
  name = 'AlignUserColumns1787160000020';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `users` MODIFY `name` varchar(255) NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `users` MODIFY `email` varchar(320) NOT NULL',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `users` MODIFY `name` varchar(100) NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `users` MODIFY `email` varchar(150) NOT NULL',
    );
  }
}