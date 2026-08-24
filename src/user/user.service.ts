import {
  Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource,
  Repository } from "typeorm";

import {
  BaseService,
  InvalidRequestException,
  USER_EVENTS_TOPIC,
} from "@ecommerce/common";
import {
  OutboxService,
} from "@ecommerce/common/persistence";

import { User } from "./entities/user.entity";

import {
  UserAlreadyExistsException,
  UserNotFoundException,
} from "./exceptions";

import {
  CreateUserData,
  UpdateUserData,
} from "./interfaces/user-service.interface";

@Injectable()
export class UsersService extends BaseService<
  User,
  CreateUserData,
  UpdateUserData
> {
  constructor(
    @InjectRepository(User)
    repository: Repository<User>,
    private readonly dataSource: DataSource,
    private readonly outboxService: OutboxService,
  ) {
    super(repository);
  }

  protected override entityName(): string {
    return "User";
  }

  protected override searchableFields(): (keyof User)[] {
    return ["name", "email"];
  }

  protected override sortableFields(): (keyof User)[] {
    return ["id", "name", "email", "createdAt", "updatedAt"];
  }

  protected override createNotFoundException(id: number): Error {
    return new UserNotFoundException(id);
  }

  async create(data: CreateUserData): Promise<User> {
    const existing = await this.findOne({
      where: {
        email: data.email,
      },
    });

    if (existing) {
      throw new UserAlreadyExistsException(data.email);
    }

    return this.dataSource.transaction(async (manager) => {
      const userRepository = manager.getRepository(User);
      const user = await userRepository.save(userRepository.create(data));

      await this.outboxService.saveToOutbox(manager, {
        aggregateType: "User",
        aggregateId: String(user.id),
        eventType: "user.registered",
        destination: `kafka:${USER_EVENTS_TOPIC}`,
        payload: {
          eventType: "user.registered",
          userId: user.id,
          name: user.name,
          email: user.email,
          registeredAt: user.createdAt.toISOString(),
        },
      });

      return user;
    });
  }

  async update(id: number, data: UpdateUserData): Promise<User> {
    if (data.name === undefined && data.email === undefined) {
      throw new InvalidRequestException(
        "At least one user field must be updated",
      );
    }

    const user = await this.findOneOrFail(id);

    if (data.email !== undefined && data.email !== user.email) {
      const existing = await this.findOne({
        where: {
          email: data.email,
        },
      });

      if (existing) {
        throw new UserAlreadyExistsException(data.email);
      }
    }

    return super.update(id, data);
  }
}
