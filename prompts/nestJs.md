### Install Dependencies and Start Local Server

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/README.md

Use these commands to install project dependencies and launch a local development server for the NestJS documentation.

```bash
$ npm install
$ npm run start
```

--------------------------------

### Example GET request with query parameters

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/controllers.md

This shows an example HTTP GET request URL with 'age' and 'breed' query parameters, demonstrating how they are passed to the controller.

```plaintext
GET /cats?age=2&breed=Persian
```

--------------------------------

### Clone and Run TypeScript Starter Project

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/introduction.md

Clone the official TypeScript starter project repository, navigate into the directory, install dependencies, and start the application. This provides an alternative to using the Nest CLI.

```bash
$ git clone https://github.com/nestjs/typescript-starter.git project
$ cd project
$ npm install
$ npm run start
```

--------------------------------

### Enable CLI Plugins with SWC Builder (Standard Setup)

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/openapi/cli-plugin.md

Use this command to start the NestJS application with the SWC builder, enabling type checking for CLI Plugins in a standard project setup.

```bash
$ nest start -b swc --type-check
```

--------------------------------

### Install gRPC packages for NestJS

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/microservices/grpc.md

Install the necessary npm packages to start building gRPC-based microservices in NestJS.

```bash
npm i --save @grpc/grpc-js @grpc/proto-loader
```

--------------------------------

### Install RabbitMQ Packages

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/microservices/rabbitmq.md

Install the necessary `amqplib` and `amqp-connection-manager` packages to enable RabbitMQ-based microservices.

```bash
$ npm i --save amqplib amqp-connection-manager
```

--------------------------------

### Execute NestJS Package Scripts

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/cli/scripts.md

Demonstrates how to run the 'build' and 'start' scripts defined in package.json, which execute the locally installed Nest CLI commands.

```bash
$ npm run build
```

```bash
$ npm run start
```

--------------------------------

### Start the default monorepo application

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/cli/workspaces.md

Executes the `start` command for the default application in a monorepo workspace.

```bash
$ nest start
```

--------------------------------

### Install Prisma Client Package

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/recipes/prisma.md

Installs the `@prisma/client` package, which provides a type-safe API for database interactions.

```bash
$ npm install @prisma/client
```

--------------------------------

### Install @fastify/cookie for Fastify

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/techniques/cookies.md

Install the `@fastify/cookie` package for use with the Fastify adapter.

```shell
npm i @fastify/cookie
```

--------------------------------

### Initialize Prisma Setup

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/recipes/prisma.md

Run this command to create the initial Prisma setup, including `schema.prisma`, `prisma.config.ts`, and `.env` files.

```bash
$ npx prisma init
```

--------------------------------

### Example GET Request for Pipe Validation

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/pipes.md

This example shows a GET request that will trigger a validation error when using `ParseIntPipe` on the `:id` parameter.

```bash
GET localhost:3000/abc
```

--------------------------------

### Example HTTP GET Request for Array Query

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/techniques/validation.md

An example HTTP GET request demonstrating how to pass comma-separated IDs as a query parameter, which can then be parsed by `ParseArrayPipe`.

```bash
GET /?ids=1,2,3
```

--------------------------------

### Install TypeORM and MySQL2 Dependencies

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/recipes/sql-typeorm.md

Install the necessary packages for TypeORM and the MySQL database driver.

```bash
$ npm install --save typeorm mysql2
```

--------------------------------

### Install SQLite Driver Adapter

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/recipes/prisma.md

Installs the `@prisma/adapter-better-sqlite3` package, required for connecting Prisma Client to SQLite databases.

```bash
npm install @prisma/adapter-better-sqlite3
```

--------------------------------

### Install swc-loader for Monorepos

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/recipes/swc.md

Install the `swc-loader` package, required for configuring Webpack to use SWC in a monorepo setup.

```bash
$ npm i --save-dev swc-loader
```

--------------------------------

### Install PostgreSQL Driver Adapter

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/recipes/prisma.md

Installs the `@prisma/adapter-pg` package, required for connecting Prisma Client to PostgreSQL databases.

```bash
npm install @prisma/adapter-pg
```

--------------------------------

### Install Redis and Socket.io Adapter Packages

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/websockets/adapter.md

Install the necessary packages for integrating Redis with the Socket.io adapter to enable broadcasting across multiple instances.

```bash
$ npm i --save redis socket.io @socket.io/redis-adapter
```

--------------------------------

### Example YAML Configuration File Structure

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/techniques/configuration.md

Illustrates a sample YAML file structure for application configuration, including HTTP and database settings.

```yaml
http:
  host: 'localhost'
  port: 8080

db:
  postgres:
    url: 'localhost'
    port: 5432
    database: 'yaml-db'

  sqlite:
    database: 'sqlite.db'
```

--------------------------------

### Start a specific monorepo application

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/cli/workspaces.md

Executes the `start` command for a named application within a monorepo workspace.

```bash
$ nest start my-app
```

--------------------------------

### Example .env File Content

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/techniques/configuration.md

Illustrates a sample `.env` file containing key-value pairs for environment variables like database credentials.

```plaintext
DATABASE_USER=test
DATABASE_PASSWORD=test
```

--------------------------------

### Configure package.json Scripts for New NestJS CLI Commands

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/cli/scripts.md

Example package.json script entries to replace older build and start commands with the new NestJS CLI commands, including development and debug watch modes.

```json
"build": "nest build",
"start": "nest start",
"start:dev": "nest start --watch",
"start:debug": "nest start --debug --watch"
```

--------------------------------

### Install NestJS CLI and Create Project

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/recipes/prisma.md

Use these commands to install the NestJS command-line interface globally and generate a new NestJS application skeleton.

```bash
$ npm install -g @nestjs/cli
$ nest new hello-prisma
```

--------------------------------

### Install Suites Core and Adapters

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/recipes/suites.md

Install the main Suites package, the NestJS dependency injection adapter, and a doubles adapter for your chosen testing framework.

```bash
$ npm install --save-dev @suites/unit @suites/di.nestjs @suites/doubles.jest
```

```bash
$ npm install --save-dev @suites/unit @suites/di.nestjs @suites/doubles.vitest
```

```bash
$ npm install --save-dev @suites/unit @suites/di.nestjs @suites/doubles.sinon
```

--------------------------------

### Install Nest CLI and Create New Project

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/first-steps.md

Use these commands in your OS terminal to globally install the Nest CLI and then scaffold a new NestJS project, creating the necessary directory and boilerplate files.

```bash
$ npm i -g @nestjs/cli
$ nest new project-name
```

--------------------------------

### Install MikroORM and NestJS Module

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/recipes/mikroorm.md

Use this command to install the core MikroORM packages, the NestJS integration module, and a specific database driver like SQLite.

```bash
$ npm i @mikro-orm/core @mikro-orm/nestjs @mikro-orm/sqlite
```

--------------------------------

### Serverless Application Benchmarks (No Webpack)

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/faq/serverless.md

These scripts are used to benchmark the cold start time of different Node.js applications in a serverless environment without Webpack bundling. They demonstrate basic setup for Express, NestJS HTTP, NestJS standalone, and a raw Node.js script.

```typescript
// #1 Express
import * as express from 'express';

async function bootstrap() {
  const app = express();
  app.get('/', (req, res) => res.send('Hello world!'));
  await new Promise<void>((resolve) => app.listen(3000, resolve));
}
bootstrap();
```

```typescript
// #2 Nest (with @nestjs/platform-express)
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['error'] });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

```typescript
// #3 Nest as a Standalone application (no HTTP server)
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppService } from './app.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error'],
  });
  console.log(app.get(AppService).getHello());
}
bootstrap();
```

```typescript
// #4 Raw Node.js script
async function bootstrap() {
  console.log('Hello world!');
}
bootstrap();
```

--------------------------------

### Install MQTT package

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/microservices/mqtt.md

Install the necessary 'mqtt' package to enable MQTT microservices in your NestJS application.

```bash
$ npm i --save mqtt
```

--------------------------------

### Install NestJS Platform WS Package

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/websockets/adapter.md

Install the `@nestjs/platform-ws` package to use the `ws` library as a WebSocket adapter.

```bash
$ npm i --save @nestjs/platform-ws
```

--------------------------------

### Install Prisma CLI as Development Dependency (npm)

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/recipes/prisma.md

Navigate into your project directory and install the Prisma CLI as a development dependency using npm.

```bash
$ cd hello-prisma
$ npm install prisma --save-dev
```

--------------------------------

### Install MariaDB/MySQL/MsSQL/AzureSQL Driver Adapter

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/recipes/prisma.md

Installs the `@prisma/adapter-mariadb` package, used for connecting Prisma Client to MariaDB, MySQL, MsSQL, or AzureSQL databases.

```bash
npm install @prisma/adapter-mariadb
```

--------------------------------

### Install SWC CLI and Core Packages

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/recipes/swc.md

Install the necessary development dependencies for using SWC with NestJS projects.

```bash
$ npm i --save-dev @swc/cli @swc/core
```

--------------------------------

### Create, Navigate, and Run a New Nest Project

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/cli/overview.md

Initializes a new Nest project, navigates into its directory, and starts the application in development mode, enabling automatic recompilation on file changes.

```bash
$ nest new my-nest-project
$ cd my-nest-project
$ npm run start:dev
```

--------------------------------

### Set Multiple Property Examples with @ApiProperty in TypeScript

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/openapi/types-and-parameters.md

Use the `examples` key within `@ApiProperty` to provide multiple named example values for a property, each with a `value`.

```typescript
@ApiProperty({
  examples: {
    Persian: { value: 'persian' },
    Tabby: { value: 'tabby' },
    Siamese: { value: 'siamese' },
    'Scottish Fold': { value: 'scottish_fold' },
  },
})
breed: string;
```

--------------------------------

### Install and Deploy with NestJS Mau CLI

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/migration.md

Use these commands to install the NestJS Mau CLI globally and deploy your application to the Mau platform.

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

--------------------------------

### Install Necord and Discord.js

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/recipes/necord.md

Use npm to install the Necord module and its required dependency, Discord.js, in your project.

```bash
$ npm install necord discord.js
```

--------------------------------

### Install KafkaJS Package

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/microservices/kafka.md

Install the `kafkajs` package, which is required to build Kafka-based microservices in NestJS.

```bash
$ npm i --save kafkajs
```

--------------------------------

### Install @fastify/compress middleware for Fastify

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/techniques/compression.md

Install the `@fastify/compress` package for use with NestJS applications running on the Fastify adapter.

```bash
$ npm i --save @fastify/compress
```

--------------------------------

### Connecting Multiple Microservices to an HTTP Application (TypeScript)

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/faq/hybrid-application.md

This example demonstrates how to connect multiple microservice instances (TCP and Redis) to a single NestJS HTTP application. Each microservice is configured with its own transport and options before starting all services.

```typescript
const app = await NestFactory.create(AppModule);
// microservice #1
const microserviceTcp = app.connectMicroservice<MicroserviceOptions>({
  transport: Transport.TCP,
  options: {
    port: 3001,
  },
});
// microservice #2
const microserviceRedis = app.connectMicroservice<MicroserviceOptions>({
  transport: Transport.REDIS,
  options: {
    host: 'localhost',
    port: 6379,
  },
});

await app.startAllMicroservices();
await app.listen(3001);
```

--------------------------------

### Enable Type Checking with SWC Builder

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/graphql/cli-plugin.md

Use this command to enable type checking when starting a NestJS application with the SWC builder for standard setups, which is required for CLI Plugins.

```bash
nest start -b swc --type-check
```

--------------------------------

### Install Joi package

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/techniques/configuration.md

Install the Joi package to enable schema validation for environment variables in NestJS applications.

```bash
$ npm install --save joi
```

--------------------------------

### Install @nestjs/schedule package

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/techniques/task-scheduling.md

Install the required dependency for task scheduling in your NestJS project.

```bash
$ npm install --save @nestjs/schedule
```

--------------------------------

### Install Bcrypt Package

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/security/encryption-hashing.md

Install the `bcrypt` package and its TypeScript type definitions for hashing passwords in a Node.js project.

```shell
$ npm i bcrypt
$ npm i -D @types/bcrypt
```

--------------------------------

### Install Keyv Redis Package

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/techniques/caching.md

Install the `@keyv/redis` package to enable Redis as an alternative cache store in your NestJS application.

```bash
$ npm install @keyv/redis
```

--------------------------------

### Basic End-to-End Test with Supertest and Express

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/fundamentals/unit-testing.md

This snippet demonstrates a typical end-to-end test setup for a NestJS application using the default Express adapter and Supertest. It initializes a test application, overrides a service, and performs a GET request to verify an API endpoint.

```typescript
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { CatsModule } from '../../src/cats/cats.module';
import { CatsService } from '../../src/cats/cats.service';
import { INestApplication } from '@nestjs/common';

describe('Cats', () => {
  let app: INestApplication;
  let catsService = { findAll: () => ['test'] };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CatsModule],
    })
      .overrideProvider(CatsService)
      .useValue(catsService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/GET cats`, () => {
    return request(app.getHttpServer())
      .get('/cats')
      .expect(200)
      .expect({
        data: catsService.findAll(),
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
```

```typescript
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { CatsModule } from '../../src/cats/cats.module';
import { CatsService } from '../../src/cats/cats.service';
import { INestApplication } from '@nestjs/common';

describe('Cats', () => {
  let app: INestApplication;
  let catsService = { findAll: () => ['test'] };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CatsModule],
    })
      .overrideProvider(CatsService)
      .useValue(catsService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/GET cats`, () => {
    return request(app.getHttpServer())
      .get('/cats')
      .expect(200)
      .expect({
        data: catsService.findAll(),
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
```

--------------------------------

### Install Nest CLI Globally with npm

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/cli/overview.md

Installs the Nest CLI globally using npm, making the `nest` executable available system-wide. Consider `npx` for managed versions.

```bash
$ npm install -g @nestjs/cli
```

--------------------------------

### Set PostgreSQL Database URL in .env

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/recipes/prisma.md

Provides `DATABASE_URL` examples for PostgreSQL, showing a placeholder version and one with the default `public` schema.

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA"
```

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
```

--------------------------------

### Set Single Property Example with @ApiProperty in TypeScript

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/openapi/types-and-parameters.md

Use the `example` key within `@ApiProperty` to provide a single example value for a property in the OpenAPI specification.

```typescript
@ApiProperty({
  example: 'persian',
})
breed: string;
```

--------------------------------

### Install Prisma CLI as Development Dependency (Yarn)

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/recipes/prisma.md

If you are using Yarn, install the Prisma CLI as a development dependency in your project.

```bash
$ yarn add prisma --dev
```

--------------------------------

### Install Fastify Helmet

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/security/helmet.md

Install the '@fastify/helmet' package for use with the Fastify adapter in your NestJS application.

```bash
$ npm i --save @fastify/helmet
```

--------------------------------

### Install NestJS Runtime Dependencies

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/recipes/suites.md

Install the core NestJS packages required for any NestJS application to run.

```bash
$ npm install @nestjs/common @nestjs/core reflect-metadata
```

--------------------------------

### Injecting Providers into a NestJS Module Class

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/modules.md

Module classes can inject providers, typically for configuration or setup purposes. This example demonstrates two methods for injecting the 'CatsService' into the 'CatsModule' constructor.

```typescript
import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
  controllers: [CatsController],
  providers: [CatsService]
})
export class CatsModule {
  constructor(private catsService: CatsService) {}
}
```

```typescript
import { Module, Dependencies } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
  controllers: [CatsController],
  providers: [CatsService]
})
@Dependencies(CatsService)
export class CatsModule {
  constructor(catsService) {
    this.catsService = catsService;
  }
}
```

--------------------------------

### REPL Initialization Output

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/recipes/repl.md

This output confirms that the NestJS application has successfully started and the REPL environment is initialized.

```bash
LOG [NestFactory] Starting Nest application...
LOG [InstanceLoader] AppModule dependencies initialized
LOG REPL initialized
```

--------------------------------

### Default Log Output with Context

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/techniques/logger.md

This example shows the default console output format, where the `context` (e.g., `NestFactory`) is printed in square brackets.

```bash
[Nest] 19096   - 12/08/2019, 7:12:59 AM   [NestFactory] Starting Nest application...
```

--------------------------------

### Install NATS Package

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/microservices/nats.md

Installs the `nats` package, which is required to build NATS-based microservices in NestJS.

```bash
$ npm i --save nats
```

--------------------------------

### Install cookie-parser for Express

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/techniques/cookies.md

Install the `cookie-parser` package and its TypeScript types for use with the Express adapter.

```shell
npm i cookie-parser
npm i -D @types/cookie-parser
```

--------------------------------

### Start Nest App with Custom .env File via CLI

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/techniques/configuration.md

Uses the Nest CLI's `--env-file` option to specify a `.env` file to load before the application starts, useful for microservice configurations.

```bash
$ nest start --env-file .env
```

--------------------------------

### Install Serverless Express and AWS Lambda Packages

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/faq/serverless.md

Install the necessary runtime and development dependencies for integrating NestJS with AWS Lambda using serverless-express and serverless-offline for local development.

```bash
$ npm i @codegenie/serverless-express aws-lambda
$ npm i -D @types/aws-lambda serverless-offline
```

--------------------------------

### Install NestJS Bull Integration

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/techniques/queues.md

Installs the necessary npm packages for integrating Bull queues into a NestJS application.

```bash
$ npm install --save @nestjs/bull bull
```

--------------------------------

### Install HMR packages for Nest CLI projects

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/recipes/hot-reload.md

Install the necessary development dependencies for Hot Module Replacement when using the Nest CLI. For Yarn Berry users, install `webpack-pnp-externals` instead of `webpack-node-externals`.

```bash
$ npm i --save-dev webpack-node-externals run-script-webpack-plugin webpack
```

--------------------------------

### Install Apollo Subgraph Dependency

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/graphql/federation.md

Installs the necessary `@apollo/subgraph` package for implementing GraphQL Federation with Apollo.

```bash
$ npm install --save @apollo/subgraph
```

--------------------------------

### Example JSON Log Output

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/techniques/logger.md

This is an example of a log entry when JSON logging is enabled, showing the structured format with level, PID, timestamp, message, and context.

```json
{
  "level": "log",
  "pid": 19096,
  "timestamp": 1607370779834,
  "message": "Starting Nest application...",
  "context": "NestFactory"
}
```

--------------------------------

### Sample Dockerfile for a NestJS Application

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/deployment.md

Defines the steps to build a Docker image for a NestJS application, including setting up Node.js, installing dependencies, building the app, and exposing the port.

```Dockerfile
# Use the official Node.js image as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the NestJS application
RUN npm run build

# Expose the application port
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/main"]
```

--------------------------------

### Install CASL Ability Package (npm)

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/security/authorization.md

Install the core `@casl/ability` package using npm to enable authorization capabilities in your project.

```bash
$ npm i @casl/ability
```

--------------------------------

### Install Vitest and SWC Integration Packages

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/recipes/swc.md

Install the required development dependencies to integrate Vitest with SWC for a fast and lightweight testing solution in NestJS projects.

```bash
$ npm i --save-dev vitest unplugin-swc @swc/core @vitest/coverage-v8
```

--------------------------------

### Install Helmet for Express

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/security/helmet.md

Install the 'helmet' package to use with the Express adapter in your NestJS application.

```bash
$ npm i --save helmet
```

--------------------------------

### Install Sequelize and TypeScript Dependencies

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/recipes/sql-sequelize.md

Install the necessary packages for Sequelize, `sequelize-typescript`, and a MySQL driver, along with development-only TypeScript type definitions.

```bash
$ npm install --save sequelize sequelize-typescript mysql2
$ npm install --save-dev @types/sequelize
```

--------------------------------

### Install Class Validator and Class Transformer

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/pipes.md

Installs the necessary packages for decorator-based validation using `class-validator` and `class-transformer`.

```bash
$ npm i --save class-validator class-transformer
```

--------------------------------

### Install BullMQ Dependencies

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/techniques/queues.md

Installs the necessary `@nestjs/bullmq` and `bullmq` packages, which are required for queue management in a NestJS project.

```bash
$ npm install --save @nestjs/bullmq bullmq
```

--------------------------------

### Install gRPC Reflection Package

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/microservices/grpc.md

Install the required package to enable gRPC server reflection in your NestJS application.

```bash
$ npm i --save @grpc/reflection
```

--------------------------------

### Exclude Specific Routes from Middleware in NestJS

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/middlewares.md

Use the `exclude()` method to prevent a middleware from being applied to certain routes. This example shows how to exclude specific GET, POST, and wildcard routes from `LoggerMiddleware`.

```typescript
consumer
  .apply(LoggerMiddleware)
  .exclude(
    { path: 'cats', method: RequestMethod.GET },
    { path: 'cats', method: RequestMethod.POST },
    'cats/{*splat}',
  )
  .forRoutes(CatsController);
```

--------------------------------

### Generate Plugin Metadata for Monorepo (SWC Builder)

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/openapi/cli-plugin.md

Run this command to generate plugin metadata for monorepo setups when using the SWC builder. Choose the appropriate path for your application.

```bash
$ npx ts-node src/generate-metadata.ts
# OR npx ts-node apps/{YOUR_APP}/src/generate-metadata.ts
```

--------------------------------

### Inject HttpService and Perform a GET Request

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/techniques/http-module.md

Inject `HttpService` into a service constructor and use its `get` method to make an HTTP GET request, returning an `Observable<AxiosResponse<Cat[]>>`.

```typescript
@Injectable()
export class CatsService {
  constructor(private readonly httpService: HttpService) {}

  findAll(): Observable<AxiosResponse<Cat[]>> {
    return this.httpService.get('http://localhost:3000/cats');
  }
}
```

```javascript
@Injectable()
@Dependencies(HttpService)
export class CatsService {
  constructor(httpService) {
    this.httpService = httpService;
  }

  findAll() {
    return this.httpService.get('http://localhost:3000/cats');
  }
}
```

--------------------------------

### Install NestJS Fastify Platform Package

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/techniques/performance.md

Installs the necessary `@nestjs/platform-fastify` package, which provides the `FastifyAdapter` for integrating Fastify as the HTTP provider in a NestJS application.

```bash
npm i --save @nestjs/platform-fastify
```

--------------------------------

### Install Mercurius Federation Dependencies

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/graphql/federation.md

Installs `@apollo/subgraph` and `@nestjs/mercurius` for implementing GraphQL Federation with Mercurius in NestJS.

```bash
$ npm install --save @apollo/subgraph @nestjs/mercurius
```

--------------------------------

### Install HMR packages for NestJS projects without CLI

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/recipes/hot-reload.md

Install the required development dependencies for Hot Module Replacement when not using the Nest CLI. For Yarn Berry users, install `webpack-pnp-externals` instead of `webpack-node-externals`.

```bash
$ npm i --save-dev webpack webpack-cli webpack-node-externals ts-loader run-script-webpack-plugin
```

--------------------------------

### Install NestJS Testing Package

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/fundamentals/unit-testing.md

Install the `@nestjs/testing` package as a development dependency to enable NestJS testing utilities.

```bash
$ npm i --save-dev @nestjs/testing
```

--------------------------------

### Install Apollo Gateway Dependency

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/graphql/federation.md

Installs the `@apollo/gateway` package, which is required to set up an Apollo Gateway for GraphQL Federation.

```bash
$ npm install --save @apollo/gateway
```

--------------------------------

### Install Multer Typings

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/techniques/file-upload.md

Install the Multer typings package for better type safety when working with file uploads in NestJS.

```shell
$ npm i -D @types/multer
```

--------------------------------

### Apply Middleware to a Specific Route and HTTP Method in NestJS

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/middlewares.md

Restrict middleware application to a particular HTTP request method by passing an object with path and method to forRoutes(). This example applies LoggerMiddleware only to GET requests on the 'cats' route.

```typescript
import { Module, NestModule, RequestMethod, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { CatsModule } from './cats/cats.module';

@Module({
  imports: [CatsModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: 'cats', method: RequestMethod.GET });
  }
}
```

```typescript
import { Module, RequestMethod } from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { CatsModule } from './cats/cats.module';

@Module({
  imports: [CatsModule],
})
export class AppModule {
  configure(consumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: 'cats', method: RequestMethod.GET });
  }
}
```

--------------------------------

### Install nestjs-cls Package

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/recipes/async-local-storage.md

Install the `nestjs-cls` package using npm to add Async Local Storage capabilities to your NestJS project.

```bash
npm i nestjs-cls
```

--------------------------------

### Configure ThrottlerModule Asynchronously with useClass

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/security/rate-limiting.md

This example demonstrates configuring the `ThrottlerModule` asynchronously by providing a class that implements the `ThrottlerOptionsFactory` interface.

```typescript
@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useClass: ThrottlerConfigService,
    }),
  ],
})
export class AppModule {}
```

--------------------------------

### Install NestJS Cache Manager Package

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/techniques/caching.md

Install the necessary packages for caching in NestJS, including `@nestjs/cache-manager` and `cache-manager`.

```bash
$ npm install @nestjs/cache-manager cache-manager
```

--------------------------------

### Create a standard NestJS project

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/cli/workspaces.md

Initializes a new NestJS application with a standard project structure.

```bash
$ nest new my-project
```

--------------------------------

### Install GraphQL and driver packages for NestJS

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/graphql/quick-start.md

Installs the necessary packages for GraphQL integration with NestJS, supporting different drivers and underlying HTTP frameworks. Choose the appropriate command based on your preferred HTTP framework and GraphQL driver.

```bash
# For Express and Apollo (default)
$ npm i @nestjs/graphql @nestjs/apollo @apollo/server @as-integrations/express5 graphql

# For Fastify and Apollo
# npm i @nestjs/graphql @nestjs/apollo @apollo/server @as-integrations/fastify graphql

# For Fastify and Mercurius
# npm i @nestjs/graphql @nestjs/mercurius graphql mercurius
```

--------------------------------

### Install NestJS Microservices Package

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/microservices/basics.md

Install the required `@nestjs/microservices` package to enable microservice development in your NestJS application.

```bash
$ npm i --save @nestjs/microservices
```

--------------------------------

### Install TypeORM and MySQL Dependencies

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/techniques/sql.md

Install the necessary packages for TypeORM integration with NestJS, including the TypeORM library and the MySQL client driver.

```bash
$ npm install --save @nestjs/typeorm typeorm mysql2
```

--------------------------------

### Install @fastify/csrf-protection package for Fastify

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/security/csrf.md

Install the `@fastify/csrf-protection` package to enable CSRF protection in NestJS applications using Fastify.

```bash
$ npm i --save @fastify/csrf-protection
```

--------------------------------

### Install Mongoose Dependencies

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/techniques/mongo.md

Install the necessary packages, @nestjs/mongoose and mongoose, to integrate MongoDB with NestJS applications.

```bash
$ npm i @nestjs/mongoose mongoose
```

--------------------------------

### Install NestJS Serve Static Package

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/recipes/serve-static.md

Install the required @nestjs/serve-static package using npm to enable static file serving capabilities in your NestJS application.

```bash
$ npm install --save @nestjs/serve-static
```

--------------------------------

### Module Dependency Graph Example

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/migration.md

Illustrates a conceptual module dependency graph where module A depends on B, and B depends on C.

```plaintext
// Where A, B, and C are modules and "->" represents the module dependency.
A -> B -> C
```

--------------------------------

### Import a Nest Library using `nest add` (Bash)

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/cli/usages.md

Use this command to import a Nest library into your project, which runs its install schematic. Replace `<name>` with the specific library package name you wish to add.

```bash
$ nest add <name> [options]
```

--------------------------------

### Constructor-based Dependency Injection Example (TypeScript)

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/components.md

Illustrates the shorthand syntax for injecting a provider, `CatsService`, into a class constructor, allowing Nest to resolve and provide the dependency.

```typescript
constructor(private catsService: CatsService) {}
```

--------------------------------

### Install Redis Transporter Package

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/microservices/redis.md

Install the `ioredis` package, which is required to use Redis as a microservice transporter in NestJS.

```bash
$ npm i --save ioredis
```

--------------------------------

### Install Zod Package

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/pipes.md

Installs the Zod library, which is used for schema-based object validation in NestJS applications.

```bash
$ npm install --save zod
```

--------------------------------

### Install compression middleware for Express

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/techniques/compression.md

Install the `compression` package and its TypeScript types for use with NestJS applications running on the Express adapter.

```bash
$ npm i --save compression
$ npm i --save-dev @types/compression
```

--------------------------------

### Install and Deploy NestJS Application with Mau CLI

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/deployment.md

Use these commands to install the NestJS Mau CLI globally and deploy your application to AWS with a single command.

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

--------------------------------

### Sample NestJS Services for Testing

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/recipes/suites.md

These services, `UserRepository` and `UserService`, are used as examples to demonstrate unit testing with Suites.

```typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository {
  async findById(id: string): Promise<User | null> {
    // Database query
  }

  async save(user: User): Promise<User> {
    // Database save
  }
}
```

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { Logger } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(
    private repository: UserRepository,
    private logger: Logger,
  ) {}

  async findById(id: string): Promise<User> {
    const user = await this.repository.findById(id);
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    this.logger.log(`Found user ${id}`);
    return user;
  }

  async create(email: string, name: string): Promise<User> {
    const user = { id: generateId(), email, name };
    await this.repository.save(user);
    this.logger.log(`Created user ${user.id}`);
    return user;
  }
}
```

--------------------------------

### Example Log Output with Timestamp

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/techniques/logger.md

This output format includes the date, time, context, message, and the time difference from the previous log entry (e.g., `+5ms`).

```bash
[Nest] 19096   - 04/19/2024, 7:12:59 AM   [MyService] Doing something with timestamp here +5ms
```

--------------------------------

### Start a NestJS Application

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/cli/usages.md

Use this command to compile and run a NestJS application or a specific project within a monorepo workspace.

```bash
$ nest start <name> [options]
```

--------------------------------

### Install NestJS Devtools Integration Package

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/devtools/overview.md

Install the `@nestjs/devtools-integration` package to add Devtools functionality to your NestJS application.

```bash
$ npm i @nestjs/devtools-integration
```

--------------------------------

### Install Terminus Dependency

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/recipes/terminus.md

Installs the `@nestjs/terminus` package, which provides health check functionalities for NestJS applications.

```bash
$ npm install --save @nestjs/terminus
```

--------------------------------

### Build NestJS Documentation for Production

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/README.md

Use this command to create a production-optimized build of the NestJS documentation.

```bash
$ npm run build:prod
```

--------------------------------

### Install graphql-query-complexity

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/graphql/complexity.md

Install the `graphql-query-complexity` package using npm to enable query complexity analysis in your NestJS GraphQL application.

```bash
$ npm install --save graphql-query-complexity
```

--------------------------------

### Scaffold a New NestJS Application

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/techniques/mvc.md

Use these commands to install the NestJS CLI globally and create a new NestJS project, which serves as the foundation for an MVC application.

```bash
$ npm i -g @nestjs/cli
$ nest new project
```

--------------------------------

### Install nest-commander package

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/recipes/nest-commander.md

Install the `nest-commander` package using npm to add command-line application capabilities to your NestJS project.

```bash
$ npm i nest-commander
```

--------------------------------

### Convert to monorepo and add an application

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/cli/workspaces.md

Changes directory into the new project and generates an additional application, converting the project into a monorepo workspace.

```bash
$ cd my-project
$ nest generate app my-app
```

--------------------------------

### End-to-End Test Configuration with Fastify Adapter

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/fundamentals/unit-testing.md

This example illustrates how to configure end-to-end tests when using the Fastify HTTP adapter in a NestJS application. It shows the necessary adjustments for createNestApplication and how to simulate HTTP requests using Fastify's app.inject method.

```typescript
let app: NestFastifyApplication;

beforeAll(async () => {
  app = moduleRef.createNestApplication<NestFastifyApplication>(
    new FastifyAdapter(),
  );

  await app.init();
  await app.getHttpAdapter().getInstance().ready();
});

it(`/GET cats`, () => {
  return app
    .inject({
      method: 'GET',
      url: '/cats',
    })
    .then((result) => {
      expect(result.statusCode).toEqual(200);
      expect(result.payload).toEqual(/* expectedPayload */);
    });
});

afterAll(async () => {
  await app.close();
});
```

--------------------------------

### Install Mongoose Dependency

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/recipes/mongodb.md

Installs the Mongoose package, which is essential for object modeling with MongoDB in NestJS applications.

```bash
$ npm install --save mongoose
```

--------------------------------

### Start NestJS Application with SWC Builder

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/recipes/swc.md

Run your NestJS application using the SWC builder via the Nest CLI command line flag.

```bash
$ nest start -b swc
# OR nest start --builder swc
```

--------------------------------

### Example Output of Executed Message Handler

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/microservices/custom-transport.md

This output demonstrates the result of executing the 'echo' message handler, confirming its proper execution.

```json
Hello world!
```

--------------------------------

### Install Jest and SWC Integration Packages

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/recipes/swc.md

Install the necessary development dependencies to integrate Jest with SWC for faster testing in your NestJS project.

```bash
$ npm i --save-dev jest @swc/core @swc/jest
```

--------------------------------

### Install NestJS Sequelize and MySQL Dependencies

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/techniques/sql.md

Install the required packages for NestJS Sequelize integration, `sequelize-typescript`, the MySQL client (`mysql2`), and Sequelize type definitions for development.

```bash
$ npm install --save @nestjs/sequelize sequelize sequelize-typescript mysql2
$ npm install --save-dev @types/sequelize
```

--------------------------------

### Scaffold New Nest Project

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/cli/overview.md

Demonstrates creating a new Nest application with the `new` command, specifying a project name and using the `--dry-run` option.

```bash
$ nest new my-nest-project --dry-run
```

--------------------------------

### Install Fastify MVC Packages

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/techniques/mvc.md

Install the required npm packages for integrating Fastify with view rendering capabilities (Handlebars) in a NestJS MVC application.

```bash
$ npm i --save @fastify/static @fastify/view handlebars
```

--------------------------------

### Get Help for a Specific Nest CLI Command

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/cli/overview.md

Provides detailed help and options for a specific Nest CLI command, such as `generate`.

```bash
$ nest generate --help
```

--------------------------------

### Build NestJS Documentation Project

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/README.md

Run this command to compile the project, storing the build artifacts in the `dist/` directory.

```bash
$ npm run build
```

--------------------------------

### Sample Commit Message for Documentation Update

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/CONTRIBUTING.md

An example of a commit message for documentation changes, specifically updating the changelog.

```text
docs(changelog): update change log to beta.5
```

--------------------------------

### Define a basic NestJS controller with a route prefix

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/controllers.md

This snippet shows how to create a basic controller using `@Controller('cats')` to define a route prefix and `@Get()` to handle GET requests. It maps `GET /cats` to the `findAll()` method, returning a string response.

```TypeScript
import { Controller, Get } from '@nestjs/common';

@Controller('cats')
export class CatsController {
  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }
}
```

```JavaScript
import { Controller, Get } from '@nestjs/common';

@Controller('cats')
export class CatsController {
  @Get()
  findAll() {
    return 'This action returns all cats';
  }
}
```

--------------------------------

### Install NestJS CLI Globally and Locally for Migration

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/cli/scripts.md

Installs the NestJS CLI globally for general use and locally as a development dependency within a project, which is recommended when migrating to new CLI commands.

```bash
$ npm install -g @nestjs/cli
$ cd  /some/project/root/folder
$ npm install -D @nestjs/cli
```

--------------------------------

### Install Sentry NestJS SDK Dependencies

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/recipes/sentry.md

Install the necessary Sentry packages for NestJS, including the optional but recommended profiling node integration.

```bash
$ npm install --save @sentry/nestjs @sentry/profiling-node
```

--------------------------------

### Install NestJS Swagger Module

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/openapi/introduction.md

Use this command to install the @nestjs/swagger package, which is required for integrating OpenAPI with your NestJS application.

```bash
$ npm install --save @nestjs/swagger
```

--------------------------------

### Install Jest and TypeScript Development Dependencies

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/recipes/suites.md

Ensure Jest and TypeScript are available for development and testing with Suites.

```bash
$ npm install --save-dev ts-jest @types/jest jest typescript
```

--------------------------------

### Install NestJS WebSockets and Socket.io Platform

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/websockets/gateways.md

Install the required packages for developing WebSockets applications with NestJS, including the core WebSockets module and the Socket.io platform adapter.

```bash
$ npm i --save @nestjs/websockets @nestjs/platform-socket.io
```

```bash
$ npm i --save @nestjs/websockets @nestjs/platform-socket.io
```

--------------------------------

### Install NestJS Config Package

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/techniques/configuration.md

Installs the `@nestjs/config` package, which provides utilities for managing application configuration using environment variables and `.env` files.

```bash
$ npm i --save @nestjs/config
```

--------------------------------

### Start NestJS REPL from Terminal

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/recipes/repl.md

Execute this command in your terminal to launch the NestJS application in REPL mode, using the `repl.ts` entry file.

```bash
$ npm run start -- --entryFile repl
```

--------------------------------

### Example User Object Structure

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/custom-decorators.md

This JSON object illustrates the structure of a user entity that might be attached to the request object after authentication.

```json
{
  "id": 101,
  "firstName": "Alan",
  "lastName": "Turing",
  "email": "alan@email.com",
  "roles": ["admin"]
}
```

--------------------------------

### Install NestJS Axios Package

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/recipes/terminus.md

Install the `@nestjs/axios` package and its `axios` dependency, required by `HttpHealthIndicator` for making HTTP requests.

```bash
npm i --save @nestjs/axios axios
```

--------------------------------

### Install Passport Local Strategy Packages

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/recipes/passport.md

Install the necessary NestJS Passport module, core Passport library, and the `passport-local` strategy along with its TypeScript type definitions.

```bash
$ npm install --save @nestjs/passport passport passport-local
$ npm install --save-dev @types/passport-local
```

--------------------------------

### Install Fastify Secure Session Package

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/techniques/sessions.md

Installs the required npm package for secure session management when using Fastify with NestJS.

```shell
$ npm i @fastify/secure-session
```

--------------------------------

### Install NestJS JWT Package

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/security/authentication.md

Installs the `@nestjs/jwt` package, which provides utilities for generating and verifying JWT tokens in a NestJS application.

```bash
$ npm install --save @nestjs/jwt
```

--------------------------------

### Install NestJS CQRS Module

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/recipes/cqrs.md

Install the `@nestjs/cqrs` package using npm to add CQRS capabilities to your NestJS application.

```bash
$ npm install --save @nestjs/cqrs
```

--------------------------------

### Define Rich Controller Operation Details with JSDoc

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/openapi/cli-plugin.md

This example illustrates how to provide comprehensive operation details, including summary, remarks, deprecation status, and response examples, using JSDoc comments for a controller method. The CLI plugin can parse these comments to enrich the OpenAPI specification.

```typescript
/**
 * Create a new cat
 *
 * @remarks This operation allows you to create a new cat.
 *
 * @deprecated
 * @throws {500} Something went wrong.
 * @throws {400} Bad Request.
 */
@Post()
async create(): Promise<Cat> {}
```

--------------------------------

### Run NestJS Application

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/first-steps.md

Starts the NestJS application, listening for inbound HTTP requests on the configured port (e.g., 3000).

```bash
$ npm run start
```

--------------------------------

### Install csrf-csrf package for Express

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/security/csrf.md

Install the `csrf-csrf` package to enable CSRF protection in NestJS applications using Express.

```bash
$ npm i csrf-csrf
```

--------------------------------

### Generate Project Documentation with Compodoc

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/recipes/documentation.md

Run Compodoc to generate documentation for your NestJS project, specifying the tsconfig.json and starting a server. Requires npm 6 for npx support.

```bash
$ npx @compodoc/compodoc -p tsconfig.json -s
```

--------------------------------

### Install NestJS Event Emitter Package

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/techniques/events.md

Install the `@nestjs/event-emitter` package using npm to enable event-driven capabilities in your NestJS application.

```shell
$ npm i --save @nestjs/event-emitter
```

--------------------------------

### Pass Options to Fastify Adapter Constructor

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/techniques/performance.md

Demonstrates how to pass configuration options, such as enabling the logger, directly to the underlying Fastify instance through the `FastifyAdapter` constructor.

```typescript
new FastifyAdapter({ logger: true });
```

--------------------------------

### Install NestJS Throttler Package

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/security/rate-limiting.md

Install the `@nestjs/throttler` package using npm to enable rate limiting functionality in your NestJS application.

```bash
$ npm i --save @nestjs/throttler
```

--------------------------------

### Create MQTT client using ClientsModule

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/microservices/mqtt.md

Register an MQTT client using ClientsModule.register() to interact with MQTT-based microservices.

```typescript
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MATH_SERVICE',
        transport: Transport.MQTT,
        options: {
          url: 'mqtt://localhost:1883',
        }
      },
    ]),
  ]
  ...
})
```

--------------------------------

### Configuring GraphQL CLI Plugin Options in nest-cli.json

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/graphql/cli-plugin.md

This example demonstrates how to customize the GraphQL CLI plugin's behavior by providing an `options` object. It shows setting `typeFileNameSuffix` to specify file patterns and enabling `introspectComments`.

```javascript
{
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "plugins": [
      {
        "name": "@nestjs/graphql",
        "options": {
          "typeFileNameSuffix": [".input.ts", ".args.ts"],
          "introspectComments": true
        }
      }
    ]
  }
}
```

--------------------------------

### Get configuration value from ConfigService

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/techniques/configuration.md

Use the `get` method of the `ConfigService` instance to retrieve a specific configuration value by its key.

```typescript
const port = configService.get('PORT');
```

--------------------------------

### Example OpenAPI Schema with Description

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/openapi/types-and-parameters.md

This YAML snippet illustrates how a schema description appears in the generated OpenAPI documentation after applying the `@ApiSchema` decorator.

```yaml
schemas:
  CreateCatDto:
    type: object
    description: Description of the CreateCatDto schema
```

--------------------------------

### Default SWC Configuration File (.swcrc)

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/recipes/swc.md

Example of a `.swcrc` file showing default configurations for NestJS applications, including TypeScript parsing options.

```json
{
  "$schema": "https://swc.rs/schema.json",
  "sourceMaps": true,
  "jsc": {
    "parser": {
      "syntax": "typescript",
      "decorators": true,
      "dynamicImport": true
    },
    "baseUrl": "./"
  },
  "minify": false
}
```

--------------------------------

### Set SQL Server Database URL in .env

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/recipes/prisma.md

Provides a placeholder `DATABASE_URL` for SQL Server, requiring replacement of `HOST`, `PORT`, `DATABASE`, `USER`, and `PASSWORD` with actual credentials.

```bash
DATABASE_URL="sqlserver://HOST:PORT;database=DATABASE;user=USER;password=PASSWORD;encrypt=true"
```

--------------------------------

### Registering ClientProxy with ClientsModule.registerAsync

Source: https://github.com/nestjs/docs.nestjs.com/blob/master/content/microservices/basics.md

Utilize ClientsModule.registerAsync() for asynchronous configuration of microservice transporters, allowing for dynamic setup based on other services like ConfigService.

```typescript
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        name: 'MATH_SERVICE',
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            url: configService.get('URL'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
})
```