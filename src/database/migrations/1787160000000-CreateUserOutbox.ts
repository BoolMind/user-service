import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserOutbox1787160000000 implements MigrationInterface {
  name = "CreateUserOutbox1787160000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`outbox_events\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`deleted_at\` datetime(6) NULL,
        \`aggregateType\` varchar(100) NOT NULL,
        \`aggregateId\` varchar(100) NOT NULL,
        \`eventType\` varchar(150) NOT NULL,
        \`destination\` varchar(100) NOT NULL,
        \`payload\` json NOT NULL,
        \`status\` enum ('PENDING', 'PROCESSING', 'PUBLISHED', 'FAILED') NOT NULL DEFAULT 'PENDING',
        \`attempts\` int NOT NULL DEFAULT '0',
        \`publishedAt\` timestamp NULL,
        \`lockedAt\` timestamp NULL,
        INDEX \`IDX_user_outbox_aggregateType\` (\`aggregateType\`),
        INDEX \`IDX_user_outbox_aggregateId\` (\`aggregateId\`),
        INDEX \`IDX_user_outbox_status\` (\`status\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DROP TABLE `outbox_events`");
  }
}
