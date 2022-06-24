import {
  MiddlewareConsumer,
  Module,
  RequestMethod,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD, APP_FILTER, APP_PIPE } from '@nestjs/core';
import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import configuration, { MongoDbConfig } from '@app/app.config';
import { UsersModule } from '@app/users/users.module';
import { AuthModule } from '@app/auth/auth.module';
import { JwtGuard } from '@app/guards/jwt.guard';
import { RolesGuard } from '@app/guards/roles.guard';
import { ProfilesModule } from '@app/profiles/profiles.module';
import { InvitationsModule } from '@app/invitations/invitations.module';
import { ProductsModule } from '@app/products/products.module';
import { StripeModule } from '@app/stripe/stripe.module';
import { SubscriptionsModule } from '@app/subscriptions/subscriptions.module';
import { SchoolsModule } from '@app/schools/schools.module';
import { AppLoggerMiddleware } from '@app/middlewares/app_logger.middleware';
import { RouteInfo } from '@nestjs/common/interfaces';
import { RawBodyMiddleware } from '@app/middlewares/raw_body.middleware';
import { JsonBodyMiddleware } from '@app/middlewares/json_body.middleware';
import { join } from 'path';
import { SeedModule } from '@app/seed/seed.module';
import { WebhooksModule } from '@app/webhooks/webhooks.module';
import { AllExceptionsFilter } from '@app/all-exceptions.filter';
import { HealthModule } from './health/health.module';
import { ValidationError } from 'class-validator';
import { number } from 'yargs';
import { MessagingModule } from './messaging/messaging.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const mongoDbConfig = configService.get<MongoDbConfig>('mongodb');
        return {
          uri: mongoDbConfig.uri,
          user: mongoDbConfig.username,
          pass: mongoDbConfig.password,
          dbName: mongoDbConfig.dbName,
          tls: mongoDbConfig.useTls,
          replicaSet: mongoDbConfig.replicaSet,
          tlsCAFile: join(__dirname, mongoDbConfig.tlsCAFilePath),
          appName: 'studyhall-api',
          retryWrites: true,
          authSource: 'admin',
        };
      },
    }),
    UsersModule,
    AuthModule,
    ProfilesModule,
    InvitationsModule,
    ProductsModule,
    StripeModule.forRoot(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2020-08-27',
    }),
    SubscriptionsModule,
    SchoolsModule,
    SeedModule,
    WebhooksModule,
    HealthModule,
    MessagingModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        exceptionFactory: (errors) => {
          const formattedErrors = formatErrors(errors);

          return new UnprocessableEntityException(formattedErrors);
        },
      }),
    },
    {
      provide: APP_FILTER,
      useValue: new AllExceptionsFilter(),
    },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(AppLoggerMiddleware)
      .forRoutes('*')
      .apply(RawBodyMiddleware)
      .forRoutes(...rawBodyParsingRoutes)
      .apply(JsonBodyMiddleware)
      .exclude(...rawBodyParsingRoutes)
      .forRoutes('*');
  }
}

const rawBodyParsingRoutes: Array<RouteInfo> = [
  {
    path: '/webhooks/stripe',
    method: RequestMethod.POST,
  },
];

const formatErrors = (errors: ValidationError[], parentName: string = '') => {
  const formattedErrors = [];

  for (const error of errors) {
    if (Array.isArray(error.value) && !error.constraints) {
      formattedErrors.push(formatErrors(error.children, error.property));
    } else if (Array.isArray(error.children) && error.children.length) {
      const ob = { name: `${parentName}.${error.property}`, errors: [] };
      ob.errors = formatErrors(error.children);
      formattedErrors.push(ob);
    } else {
      const err = {};
      err[error.property] = Object.keys(error.constraints).map(
        (p) => error.constraints[p],
      );
      formattedErrors.push(err);
    }
  }

  return formattedErrors.flat();
};
