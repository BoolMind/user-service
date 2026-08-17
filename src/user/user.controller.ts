import { GrpcController } from "@ecommerce/common";
import { toGrpcDeleteResponse, toGrpcPageMeta } from "@ecommerce/common";

import {
  UserServiceCreateRequest,
  UserServiceCreateResponse,
  UserServiceDeleteRequest,
  UserServiceDeleteResponse,
  UserServiceGetByIdRequest,
  UserServiceGetByIdResponse,
  UserServicePaginateRequest,
  UserServicePaginateResponse,
  UserServiceRestoreRequest,
  UserServiceRestoreResponse,
  UserServiceUpdateRequest,
  UserServiceUpdateResponse,
} from "@ecommerce/contracts/generated/ecommerce/user/v1/user";

import { UsersService } from "./user.service";
import { userToGrpc } from "./mappers/user.mapper";

@GrpcController("UserService")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  async create(
    request: UserServiceCreateRequest,
  ): Promise<UserServiceCreateResponse> {
    const user = await this.usersService.create(request);

    return {
      user: userToGrpc(user),
    };
  }

  async getById(
    request: UserServiceGetByIdRequest,
  ): Promise<UserServiceGetByIdResponse> {
    const user = await this.usersService.findOneOrFail(request.id);

    return {
      user: userToGrpc(user),
    };
  }

  async update(
    request: UserServiceUpdateRequest,
  ): Promise<UserServiceUpdateResponse> {
    const { id, ...data } = request;

    const user = await this.usersService.update(id, data);

    return {
      user: userToGrpc(user),
    };
  }

  async delete(
  request: UserServiceDeleteRequest,
): Promise<UserServiceDeleteResponse> {
  await this.usersService.softDelete(request.id);

  return toGrpcDeleteResponse();
}

  async restore(
    request: UserServiceRestoreRequest,
  ): Promise<UserServiceRestoreResponse> {
    const user = await this.usersService.restore(request.id);

    return {
      user: userToGrpc(user),
    };
  }

  async paginate(
    request: UserServicePaginateRequest,
  ): Promise<UserServicePaginateResponse> {
    const result = await this.usersService.paginate({
      page: request.page,
      limit: request.limit,
      search: request.search,
      orderBy: request.orderBy,
      order:
        request.order === 1 ? "ASC" : request.order === 2 ? "DESC" : undefined,
    });

    return {
      items: result.data.map(userToGrpc),
      meta: toGrpcPageMeta(result.meta),
    };
  }
}
