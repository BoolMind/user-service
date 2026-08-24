import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";

import { appConfig, grpcConfig, databaseConfig } from "./config";
import { envValidationSchema } from "./config/env.validation";

import { DatabaseModule } from "./database";
import { UsersModule } from "./user";

import { HealthModule, LoggerModule } from "@ecommerce/common";

import {
  GrpcLoggingInterceptor,
  GrpcValidationInterceptor,
  GrpcExceptionFilter,
} from "@ecommerce/common";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, grpcConfig],
      envFilePath: ".env",
      validationSchema: envValidationSchema,
    }),

    LoggerModule,
    DatabaseModule,
    HealthModule,
    UsersModule,
  ],

  providers: [
    {
      provide: APP_FILTER,
      useClass: GrpcExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: GrpcLoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: GrpcValidationInterceptor,
    },
  ],
})
export class AppModule {}
