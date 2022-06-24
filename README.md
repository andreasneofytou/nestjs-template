<p align="center">
  <img src="https://cdn-icons-png.flaticon.com/512/2172/2172167.png" width="150" alt="Logo" />
</p>


## Description

This project is develped using [Nest](https://github.com/nestjs/nest) framework.

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Mongo DB

Before running the project, you need to have a MongoDB instance running.
This project includes a docker-compose file for a MongoDB instance which
you can run with the following command

`docker-compose -f mongo-compose.yml up -d`

# connection settings

The MongoDB connection settings in the 'mongo-compose.yml' file are read
from the `.env` file.

## Swagger Documentation

The API documentation is generated using Swagger and it can be accessed at `/documentation`
