import { Column, Entity } from 'typeorm';

import { AppBaseEntity } from '@ecommerce/common';

@Entity('users')
export class User extends AppBaseEntity {
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  name!: string;

  @Column({
    type: 'varchar',
    length: 320,
    unique: true,
    nullable: false,
  })
  email!: string;
}