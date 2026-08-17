# User Service

The User Service is a NestJS microservice responsible for managing users in the Ecommerce Microservices system.

It communicates with other services through gRPC and maintains its own MySQL database.

## Architecture

```text
API Gateway
     |
     | gRPC
     v
User Service
     |
     v
MySQL
```

## Responsibilities

* Create users
* Retrieve users
* Update users
* Delete users
* Restore users
* Manage user persistence
* Provide user operations through gRPC

## Tech Stack

* Node.js
* NestJS
* TypeScript
* TypeORM
* MySQL
* gRPC
* Protocol Buffers

## Related Services

* [API Gateway](https://github.com/BoolMind/api-gateway)
* [Catalog Service](https://github.com/BoolMind/catalog-service)
* [Common](https://github.com/BoolMind/ecommerce-common)
* [Ecommerce Contracts](https://github.com/BoolMind/ecommerce-contracts)

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file based on `.env.example`.

Example:

```env
NODE_ENV=development
SERVICE_NAME=user-service
PORT=3001

DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=
DB_PASSWORD=
DB_NAME=user_db

DB_SYNCHRONIZE=false
DB_LOGGING=false

GRPC_HOST=localhost
GRPC_PORT=50051
```

Do not commit the `.env` file.

## Database

The service uses MySQL and TypeORM.

Database schema changes are managed using TypeORM migrations.

Run migrations:

```bash
npm run migration:run
```

Generate a migration:

```bash
npm run migration:generate
```

## Running the Application

Development:

```bash
npm run start:dev
```

Build:

```bash
npm run build
```

Production:

```bash
npm run start:prod
```

## License

Private project developed under BoolMind.
