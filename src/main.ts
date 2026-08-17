import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';
import { GrpcExceptionFilter } from '@ecommerce/common';
import { AppLogger } from '@ecommerce/common';

const contractsPath = require.resolve('@ecommerce/contracts/package.json')
  .replace('/package.json', '');

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.GRPC,

    options: {
      package: [
        'ecommerce.user.v1',
        'ecommerce.common.v1',
      ],

      protoPath: [
        `${contractsPath}/proto/ecommerce/user/v1/user.proto`,
        `${contractsPath}/proto/ecommerce/common/v1/health.proto`,
      ],

      loader: {
        includeDirs: [
          `${contractsPath}/proto`,
          `${contractsPath}/dependencies`,
        ],
      },

      url: `${process.env.GRPC_HOST ?? '0.0.0.0'}:${
        process.env.GRPC_PORT ?? 50052
      }`,
    },
  });

  app.useLogger(app.get(AppLogger));
  app.useGlobalFilters(new GrpcExceptionFilter());

  await app.listen();

  console.log(
    `🚀 User gRPC service running on ${
      process.env.GRPC_PORT ?? 50052
    }`,
  );
}

bootstrap();
