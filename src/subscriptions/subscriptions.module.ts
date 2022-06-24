import { Module } from '@nestjs/common';
import { SubscriptionsService } from '@app/subscriptions/subscriptions.service';
import { SubscriptionsController } from '@app/subscriptions/subscriptions.controller';
import { StripeModule } from '@app/stripe/stripe.module';
import {
  Subscription,
  SubscriptionSchema,
} from '@app/subscriptions/schema/subscription.schema';
import { MongooseModule } from '@nestjs/mongoose';
import {
  UserPaymentProvider,
  UserPaymentProviderSchema,
} from '@app/subscriptions/schema/user-payment-provider.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Subscription.name, schema: SubscriptionSchema },
      { name: UserPaymentProvider.name, schema: UserPaymentProviderSchema },
    ]),
  ],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService],
  exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
