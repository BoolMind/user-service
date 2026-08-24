import "dotenv/config";
import { initTracing } from "@ecommerce/common";
initTracing(process.env.SERVICE_NAME ?? "user-service");

import { NestFactory } from "@nestjs/core";
import { Transport } from "@nestjs/microservices";

import { AppModule } from "./app.module";
import { AppLogger } from "@ecommerce/common";
import { grpcConfig } from "./config";

const contractsPath = require
  .resolve("@ecommerce/contracts/package.json")
  .replace("/package.json", "");

async function bootstrap() {
  const config = grpcConfig();

  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.GRPC,

    options: {
      package: ["ecommerce.user.v1", "ecommerce.common.v1"],

      protoPath: [
        `${contractsPath}/proto/ecommerce/user/v1/user.proto`,
        `${contractsPath}/proto/ecommerce/common/v1/health.proto`,
      ],

      loader: {
        longs: Number,
        includeDirs: [
          `${contractsPath}/proto`,
          `${contractsPath}/dependencies`,
        ],
      },

      url: config.url,
    },
  });

  app.useLogger(app.get(AppLogger));

  await app.listen();

  app.get(AppLogger).log(`User gRPC service running on ${config.url}`);
}

bootstrap();
