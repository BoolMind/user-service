import { NotFoundExceptionBase } from '@ecommerce/common';

import { UserErrorCode } from './user.error-code.enum';

export class UserNotFoundException
  extends NotFoundExceptionBase<UserErrorCode>
{
  constructor(id: number) {
    super(
      UserErrorCode.USER_NOT_FOUND,
      `User with id ${id} not found.`,
    );
  }
}