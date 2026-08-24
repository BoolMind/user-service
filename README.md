# User Service

The User Service is responsible for user management within the Ecommerce microservices system.

It exposes a gRPC API for user-related operations and uses MySQL with TypeORM for persistence. User events are published through Kafka using the transactional outbox pattern.

## Architecture

The User Service communicates with:

- API Gateway through gRPC
- Catalog Service through gRPC when required by the system
- Kafka for publishing user events
- MySQL for persistent user data

The gRPC contracts are provided by the `ecommerce-contracts` repository.

Shared infrastructure and utilities are provided by `@ecommerce/common`.

## Responsibilities

- Create users
- Retrieve users
- Update users
- Delete users
- Restore users
- Paginate and search users
- Validate gRPC requests
- Handle domain and database exceptions
- Persist user data in MySQL
- Publish user events through Kafka
- Maintain reliable event publishing using the outbox pattern
- Provide gRPC health checks
- Provide application logging
- Initialize distributed tracing

## Project Structure

```text
user-service/
├── src/
│   ├── config/
│   │   ├── app.config.ts
│   │   ├── database.config.ts
│   │   ├── env.validation.ts
│   │   ├── grpc.config.ts
│   │   └── index.ts
│   │
│   ├── database/
│   │   ├── migrations/
│   │   ├── database.module.ts
│   │   ├── data-source.ts
│   │   └── index.ts
│   │
│   ├── user/
│   │   ├── entities/
│   │   ├── exceptions/
│   │   ├── interfaces/
│   │   ├── mappers/
│   │   ├── user.controller.ts
│   │   ├── user.module.ts
│   │   ├── user.service.ts
│   │   ├── user-outbox.poller.ts
│   │   └── user-outbox.publisher.ts
│   │
│   ├── app.module.ts
│   └── main.ts
│
├── .env.example
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── nest-cli.json
├── package.json
├── package-lock.json
├── tsconfig.json
├── tsconfig.build.json
└── README.md
```

## gRPC API

The User Service exposes its API through gRPC.

The service implements the user-related operations defined by the Protocol Buffer contracts in `@ecommerce/contracts`.

The main operations include:

- Create
- Get by ID
- Update
- Delete
- Restore
- Paginate

The gRPC implementation is handled through:

```text
src/user/user.controller.ts
```

The business logic is implemented in:

```text
src/user/user.service.ts
```

## User Module

The user module contains the main user-management components.

### Controller

```text
src/user/user.controller.ts
```

Handles incoming gRPC requests and delegates business operations to `UsersService`.

### Service

```text
src/user/user.service.ts
```

Contains the user-management business logic and persistence operations.

### Entity

```text
src/user/entities/user.entity.ts
```

Defines the TypeORM user entity used for database persistence.

### Mappers

```text
src/user/mappers/
```

Maps database entities and domain data to the structures required by the gRPC API.

## Database

The service uses MySQL with TypeORM.

Database configuration is located under:

```text
src/config/database.config.ts
```

Database module configuration is located under:

```text
src/database/
```

Schema changes are managed using TypeORM migrations.

```text
src/database/migrations/
```

Run migrations using the migration scripts defined in `package.json`.

## Transactional Outbox

User events are published using the transactional outbox pattern.

The outbox implementation consists of:

```text
src/user/user-outbox.poller.ts
src/user/user-outbox.publisher.ts
```

The outbox allows user changes and their corresponding events to be persisted reliably before the events are published to Kafka.

The shared `OutboxService` from `@ecommerce/common` is used for outbox persistence.

## Kafka Events

The User Service publishes user-related events through Kafka.

The Kafka producer is registered in:

```text
src/user/user.module.ts
```

The event publishing flow uses the outbox records rather than publishing directly from the user transaction.

This helps prevent situations where the database transaction succeeds but event publication fails.

## Validation

gRPC request validation is handled through the shared validation infrastructure provided by `@ecommerce/common`.

The service uses:

- gRPC validation interceptors
- DTO/protobuf validation
- Centralized gRPC exception handling

## Error Handling

Global gRPC exception handling is configured in:

```text
src/app.module.ts
```

The service uses the shared exception and filtering infrastructure from `@ecommerce/common`.

Database and domain-specific user exceptions are located under:

```text
src/user/exceptions/
```

## Health Checks

The service includes the shared health infrastructure provided by `@ecommerce/common`.

The health functionality is exposed through the service's gRPC interface and can be used by other services to determine whether the User Service is available.

## Logging

The User Service uses the application logger provided by `@ecommerce/common`.

The logger is configured during application bootstrap.

## Configuration

Configuration is handled through NestJS `ConfigModule`.

Configuration files are located under:

```text
src/config/
```

Environment variables are validated using:

```text
src/config/env.validation.ts
```

Create a local `.env` file using `.env.example` as a reference.

Do not commit secrets or actual environment values.

## gRPC Configuration

The gRPC server configuration is defined in:

```text
src/config/grpc.config.ts
```

The service uses:

- `GRPC_HOST`
- `GRPC_PORT`

The default gRPC port is:

```text
50051
```

## Tracing

Distributed tracing is initialized during application startup.

The service name is taken from the `SERVICE_NAME` environment variable and defaults to:

```text
user-service
```

## Installation

Install dependencies:

```bash
npm install
```

## Development

Start the service in development mode:

```bash
npm run start:dev
```

## Build

Build the service:

```bash
npm run build
```

## Production

Start the compiled application:

```bash
npm run start:prod
```

## Type Checking

Run TypeScript type checking without emitting files:

```bash
npx tsc --noEmit
```

## Formatting

Format the source code using Prettier:

```bash
npx prettier --write src
```

## Database Migrations

Run the migration commands defined in `package.json`.

The migration source files are located under:

```text
src/database/migrations/
```

## Docker

The repository includes Docker configuration for running the service:

```text
Dockerfile
docker-compose.yml
```

## Environment

Use `.env.example` as the reference for local environment configuration.

Actual `.env` files and secrets should remain local and are excluded through `.gitignore`.

## Shared Components

### `@ecommerce/common`

Provides shared infrastructure and reusable functionality across the microservices system, including:

- Logging
- Exception handling
- gRPC utilities
- Health checks
- Interceptors
- Messaging utilities
- Distributed tracing
- Outbox functionality
- Shared DTOs and interfaces

### `@ecommerce/contracts`

Provides the Protocol Buffer contracts used by the User Service for gRPC communication.

The service implements the user-related contracts without directly depending on the internal implementation of other services.