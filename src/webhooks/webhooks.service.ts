import { StripeConfig } from '@app/app.config';
import { STRIPE_CLIENT } from '@app/stripe/stripe.module';
import { SubscriptionStatus } from '@app/subscriptions/schema/subscription.schema';
import { PaymentProvider } from '@app/subscriptions/schema/user-payment-provider.schema';
import { SubscriptionsService } from '@app/subscriptions/subscriptions.service';
import { UsersService } from '@app/users/users.service';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

const supportedStripeTypes = ['checkout.session.completed'];

@Injectable()
export class WebhooksService {
  private stripeConfig: StripeConfig;

  constructor(
    @Inject(STRIPE_CLIENT)
    private readonly stripe: Stripe,
    private readonly subscriptionsService: SubscriptionsService,
    private readonly usersService: UsersService,
    readonly configService: ConfigService,
  ) {
    this.stripeConfig = configService.get<StripeConfig>('stripe');
  }

  async handleStripeUpdate(stripeSignature: string, payload: any) {
    const { type, data } = await this.stripe.webhooks.constructEventAsync(
      payload,
      stripeSignature,
      this.stripeConfig.customerWebhookSecret,
    );

    if (supportedStripeTypes.indexOf(type) === -1) {
      return;
    }

    const sub = await this.subscriptionsService.getSubscription(
      data.object['id'] as string,
    );

    switch (type) {
      case 'checkout.session.completed':
        await this.usersService.updateWhere(
          { _id: sub.userId },
          { isCompleted: true },
        );

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        sub.status = data.object['status'] as SubscriptionStatus;
        sub.created = new Date(data.object['created'] * 1000);
        sub.currentPeriodEnd = new Date(
          data.object['current_period_end'] * 1000,
        );
        sub.currentPeriodStart = new Date(
          data.object['current_period_start'] * 1000,
        );

        await sub.save();
    }
  }
}
