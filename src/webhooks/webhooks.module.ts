import { StripeModule } from '@app/stripe/stripe.module';
import { Module } from '@nestjs/common';
import { WebhooksController } from '@app/webhooks/webhooks.controller';
import { WebhooksService } from '@app/webhooks/webhooks.service';
import { SubscriptionsModule } from '@app/subscriptions/subscriptions.module';
import { UsersModule } from '@app/users/users.module';

@Module({
  imports: [StripeModule, SubscriptionsModule, UsersModule],
  controllers: [WebhooksController],
  providers: [WebhooksService],
})
export class WebhooksModule {}
