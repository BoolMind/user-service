import 'dotenv/config';

import { DataSource } from 'typeorm';
import { OutboxEntity } from '@ecommerce/common';

export default new DataSource({
  type: 'mysql',

  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  synchronize: false,

  logging: process.env.DB_LOGGING === 'true',

  entities: ['src*.entity.ts', OutboxEntity],
  migrations: ['src/database/migrations/*.ts'],
});