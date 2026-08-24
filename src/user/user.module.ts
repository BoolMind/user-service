import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { KafkaModule } from "@ecommerce/common";
import {
  OutboxEntity,
  OutboxService,
} from "@ecommerce/common/persistence";

import { User } from "./entities/user.entity";
import { UsersService } from "./user.service";
import { UsersController } from "./user.controller";
import { UserOutboxPublisher } from "./user-outbox.publisher";
import { UserOutboxPoller } from "./user-outbox.poller";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, OutboxEntity]),
    KafkaModule.registerClient({
      name: "USER_EVENTS_PRODUCER",
      clientId: "user-service-producer",
    }),
  ],

  controllers: [UsersController],

  providers: [
    UsersService,
    OutboxService,
    UserOutboxPublisher,
    UserOutboxPoller,
  ],

  exports: [UsersService],
})
export class UsersModule {}
