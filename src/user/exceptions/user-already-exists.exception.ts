import { AlreadyExistsExceptionBase } from "@ecommerce/common";

import { UserErrorCode } from './user.error-code.enum';

export class UserAlreadyExistsException
  extends AlreadyExistsExceptionBase<UserErrorCode>
{
  constructor(email: string) {
    super(
      UserErrorCode.USER_ALREADY_EXISTS,
      `User with email "${email}" already exists.`,
    );
  }
}