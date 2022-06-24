import { DynamicModule, Module, Provider } from '@nestjs/common';
import { Stripe } from 'stripe';

export const STRIPE_CLIENT = 'STRIPE_CLIENT';
export const STRIPE_SIGNATURE = 'stripe-signature';

@Module({})
export class StripeModule {
  static forRoot(
    secretKey: string,
    config: Stripe.StripeConfig,
  ): DynamicModule {
    const stripe = new Stripe(secretKey, config);

    const stripeProvider: Provider = {
      provide: STRIPE_CLIENT,
      useValue: stripe,
    };

    return {
      module: StripeModule,
      providers: [stripeProvider],
      exports: [stripeProvider],
      global: true,
    };
  }
}
