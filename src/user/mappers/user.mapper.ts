import { dateToTimestamp } from '@ecommerce/common';

import { User as UserEntity } from '../entities/user.entity';
import { User as UserGrpc } from '@ecommerce/contracts/generated/ecommerce/user/v1/user';

export function userToGrpc(user: UserEntity): UserGrpc {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: dateToTimestamp(user.createdAt),
    updatedAt: dateToTimestamp(user.updatedAt),
  };
}