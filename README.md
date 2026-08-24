# User Service

The User Service manages users within the Ecommerce microservices system.

It exposes a gRPC API for user-related operations, persists user data using MySQL and TypeORM, and publishes user-related events through Kafka using the transactional outbox pattern.

## Responsibilities

- Create users
- Retrieve users
- Update users
- Delete users
- Restore users
- Paginate and search users
- Validate incoming gRPC requests
- Persist user data using TypeORM
- Publish user-related events through Kafka
- Reliably publish events using the transactional outbox pattern
- Handle domain and database exceptions
- Provide centralized gRPC exception handling
- Provide health monitoring
- Provide application logging
- Initialize distributed tracing

## Architecture

The User Service communicates with other components of the Ecommerce microservices system through gRPC and Kafka.

### gRPC

The service exposes user-related operations through gRPC.

The Protocol Buffer contracts are provided by the shared `@ecommerce/contracts` package.

### Kafka

The service publishes user-related events through Kafka.

User changes are persisted together with outbox records. A background poller processes pending outbox records and publishes the corresponding events through Kafka.

### Database

The service uses MySQL with TypeORM for persistent user data and outbox records.

## Project Structure

```text
user-service/
├── docker-compose.yml
├── Dockerfile
├── nest-cli.json
├── package.json
├── package-lock.json
├── README.md
├── src
│   ├── app.module.ts
│   │
│   ├── config
│   │   ├── app.config.ts
│   │   ├── database.config.ts
│   │   ├── env.validation.ts
│   │   ├── grpc.config.ts
│   │   └── index.ts
│   │
│   ├── database
│   │   ├── database.module.ts
│   │   ├── data-source.ts
│   │   ├── index.ts
│   │   └── migrations
│   │       ├── 1786443122743-InitialUserSchema.ts
│   │       ├── 1787160000000-CreateUserOutbox.ts
│   │       └── 1787160000020-AlignUserColumns.ts
│   │
│   ├── main.ts
│   │
│   └── user
│       ├── entities
│       │   ├── index.ts
│       │   └── user.entity.ts
│       │
│       ├── exceptions
│       │   ├── index.ts
│       │   ├── user-already-exists.exception.ts
│       │   ├── user.error-code.enum.ts
│       │   └── user-not-found.exception.ts
│       │
│       ├── index.ts
│       │
│       ├── interfaces
│       │   ├── index.ts
│       │   └── user-service.interface.ts
│       │
│       ├── mappers
│       │   ├── index.ts
│       │   └── user.mapper.ts
│       │
│       ├── user.controller.ts
│       ├── user.module.ts
│       ├── user-outbox.poller.ts
│       ├── user-outbox.publisher.ts
│       └── user.service.ts
│
├── tsconfig.build.json
└── tsconfig.json
```

## User Module

The main user functionality is contained in:

```text
src/user/
```

The module contains the controller, service, entity, exceptions, interfaces, mappers, and transactional outbox components.

### User Controller

```text
src/user/user.controller.ts
```

The controller exposes the User Service gRPC operations defined by the shared Protocol Buffer contracts.

It receives gRPC requests and delegates business operations to `UserService`.

### User Service

```text
src/user/user.service.ts
```

The service contains the business logic for user management and coordinates persistence and outbox operations.

User operations include:

- Creating users
- Retrieving users
- Updating users
- Deleting users
- Restoring users
- Paginating users
- Searching users

### User Entity

```text
src/user/entities/user.entity.ts
```

The User entity defines the TypeORM representation of users stored in the database.

### Interfaces

```text
src/user/interfaces/
```

The interfaces define contracts used by the user module, including the user service interface.

### Mappers

```text
src/user/mappers/
```

Mappers convert user entities and service-level data into the structures required by the gRPC layer.

## User Exceptions

User-specific exceptions are located under:

```text
src/user/exceptions/
```

The module contains exceptions for:

- User already exists
- User not found

Error codes are defined in:

```text
src/user/exceptions/user.error-code.enum.ts
```

These domain-specific exceptions are used together with the shared gRPC exception-handling infrastructure.

## Database

The User Service uses MySQL with TypeORM.

Database configuration is located under:

```text
src/config/database.config.ts
```

The database module and TypeORM data source are located under:

```text
src/database/
```

The main database files are:

```text
src/database/database.module.ts
src/database/data-source.ts
```

Database schema changes are managed through TypeORM migrations.

## Database Migrations

User Service migrations are located under:

```text
src/database/migrations/
```

The current migrations include:

```text
1786443122743-InitialUserSchema.ts
1787160000000-CreateUserOutbox.ts
1787160000020-AlignUserColumns.ts
```

These migrations are used to create and evolve the user database schema and support the transactional outbox implementation.

## Transactional Outbox

The User Service uses the transactional outbox pattern for reliable event publishing.

The outbox components are located under:

```text
src/user/user-outbox.poller.ts
src/user/user-outbox.publisher.ts
```

The general flow is:

1. A user operation is performed.
2. The user database changes are persisted.
3. An outbox record is persisted as part of the database transaction.
4. The outbox poller checks for pending events.
5. Pending events are passed to the outbox publisher.
6. The publisher publishes the events to Kafka.
7. Successfully published outbox records are handled according to the outbox implementation.

This approach helps prevent inconsistencies where the database transaction succeeds but the corresponding event is not published.

## Kafka

The User Service publishes user-related events through Kafka.

Kafka publishing is handled by the outbox publishing components:

```text
src/user/user-outbox.poller.ts
src/user/user-outbox.publisher.ts
```

The service does not rely on direct event publication from the user database operation. Instead, events are persisted through the outbox mechanism before being published.

## gRPC

The User Service exposes its API through gRPC.

The gRPC server configuration is located under:

```text
src/config/grpc.config.ts
```

The gRPC controller implementation is located at:

```text
src/user/user.controller.ts
```

The service uses Protocol Buffer contracts provided by:

```text
@ecommerce/contracts
```

These contracts define the request, response, and service interfaces used for communication between the User Service and other microservices.

## Validation

Incoming gRPC requests are validated using the shared validation infrastructure provided by `@ecommerce/common`.

Validation is handled through the application's gRPC validation pipeline and the validation rules defined by the shared contracts.

Validation helps ensure that invalid requests are rejected before reaching the user business logic.

## Error Handling

The User Service uses the shared gRPC exception-handling infrastructure provided by `@ecommerce/common`.

User-specific exceptions are located under:

```text
src/user/exceptions/
```

The service handles domain-specific cases such as:

- User not found
- User already exists
- Invalid user operations
- Database-related failures

The shared exception infrastructure converts application errors into appropriate gRPC responses.

## Health Checks

The User Service uses the shared health infrastructure provided by `@ecommerce/common`.

Health checks allow the service and surrounding infrastructure to determine whether the User Service is available and operational.

## Logging

Application logging is provided through the shared infrastructure from `@ecommerce/common`.

Logging is initialized during application startup and can be used throughout the User Service.

## Tracing

Distributed tracing is initialized during application startup.

The service uses the configured service name when creating tracing information so that User Service operations can be identified within the distributed Ecommerce system.

## Configuration

Configuration is handled through NestJS `ConfigModule`.

Configuration files are located under:

```text
src/config/
```

The configuration components include:

```text
src/config/app.config.ts
src/config/database.config.ts
src/config/grpc.config.ts
src/config/env.validation.ts
```

### Application Configuration

```text
src/config/app.config.ts
```

Contains application-level configuration.

### Database Configuration

```text
src/config/database.config.ts
```

Contains database connection configuration used by the User Service.

### gRPC Configuration

```text
src/config/grpc.config.ts
```

Contains the gRPC server configuration.

### Environment Validation

```text
src/config/env.validation.ts
```

Defines validation for required environment variables.

Environment-specific values should be provided through a local `.env` file.

Do not commit secrets or production credentials to the repository.

## Installation

Install the project dependencies:

```bash
npm install
```

## Development

Start the User Service in development mode:

```bash
npm run start:dev
```

## Build

Build the application:

```bash
npm run build
```

## Production

Start the compiled application:

```bash
npm run start:prod
```

## Type Checking

Run TypeScript type checking without generating output:

```bash
npx tsc --noEmit
```

## Formatting

Format the source code using Prettier:

```bash
npx prettier --write src
```

## Database Migrations

Migration commands are defined in `package.json`.

Migration source files are located under:

```text
src/database/migrations/
```

Use the project's configured TypeORM migration commands to run, revert, or inspect migrations.

## Docker

The repository contains Docker configuration for running the User Service:

```text
Dockerfile
docker-compose.yml
```

Build the Docker image with:

```bash
docker build -t user-service .
```

The Docker Compose configuration can be used to run the service together with its configured dependencies.

## Environment

Environment configuration should be provided through a local `.env` file.

Use the project's environment configuration and validation files as the reference:

```text
src/config/
```

Do not commit:

- Database credentials
- Kafka credentials
- Production configuration
- Other secrets

## Shared Components

### `@ecommerce/common`

The User Service uses the shared `@ecommerce/common` package for reusable infrastructure across the Ecommerce microservices system.

Shared functionality includes:

- Application logging
- gRPC utilities
- Exception handling
- Validation infrastructure
- Health checks
- Interceptors
- Distributed tracing
- Messaging utilities
- Outbox functionality
- Shared interfaces and utilities

### `@ecommerce/contracts`

The User Service uses `@ecommerce/contracts` for its Protocol Buffer definitions.

These contracts provide the gRPC service definitions, request messages, response messages, and shared types required for communication between microservices.

## Service Startup

The application entry point is:

```text
src/main.ts
```

The NestJS application and gRPC server are initialized from this entry point.

The root application module is:

```text
src/app.module.ts
```

The User module is registered through the application's module structure.

## Summary

The User Service is responsible for user management in the Ecommerce microservices system.

It provides:

- gRPC-based user management
- MySQL persistence through TypeORM
- TypeORM migrations
- User-specific domain exceptions
- Request validation
- Kafka event publishing
- Transactional outbox processing
- Health monitoring
- Centralized logging
- Distributed tracing
- Docker support

The service operates as an independent microservice while using the shared `@ecommerce/common` infrastructure and `@ecommerce/contracts` for consistency across the Ecommerce system.
