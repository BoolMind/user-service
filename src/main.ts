import 'dotenv/config';
import { initTracing } from '@ecommerce/common';
initTracing(process.env.SERVICE_NAME ?? 'user-service');

import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';
import { AppLogger, GrpcExceptionFilter } from '@ecommerce/common';
import { grpcConfig } from './config';

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
        longs: Number,
        includeDirs: [
          `${contractsPath}/proto`,
          `${contractsPath}/dependencies`,
        ],
      },

      url: `${grpcConfig().host}:${grpcConfig().port}`,
    },
  });

  app.useLogger(app.get(AppLogger));
  app.useGlobalFilters(new GrpcExceptionFilter());

  await app.listen();

  app.get(AppLogger).log(
    `User gRPC service running on ${grpcConfig().host}:${grpcConfig().port}`,
  );
}

bootstrap();
