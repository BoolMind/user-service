
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseService } from '@ecommerce/common';

import { User } from './entities/user.entity';

import {
  UserAlreadyExistsException,
  UserNotFoundException,
} from './exceptions';

import {
  CreateUserData,
  UpdateUserData,
} from './interfaces/user-service.interface';

@Injectable()
export class UsersService extends BaseService<
  User,
  CreateUserData,
  UpdateUserData
> {
  constructor(
    @InjectRepository(User)
    repository: Repository<User>,
  ) {
    super(repository);
  }

  protected override entityName(): string {
    return 'User';
  }

  protected override searchableFields(): (keyof User)[] {
    return ['name', 'email'];
  }

 
  protected override createNotFoundException(
    id: number,
  ): Error {
    return new UserNotFoundException(id);
  }

  async create(
    data: CreateUserData,
  ): Promise<User> {
    const existing = await this.findOne({
      where: {
        email: data.email,
      },
    });

    if (existing) {
      throw new UserAlreadyExistsException(
        data.email,
      );
    }

    return super.create(data);
  }

  async update(
    id: number,
    data: UpdateUserData,
  ): Promise<User> {
    const user = await this.findOneOrFail(id);

    if (
      data.email !== undefined &&
      data.email !== user.email
    ) {
      const existing = await this.findOne({
        where: {
          email: data.email,
        },
      });

      if (existing) {
        throw new UserAlreadyExistsException(
          data.email,
        );
      }
    }

    return super.update(id, data);
  }
}

