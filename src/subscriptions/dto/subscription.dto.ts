import { SubscriptionStatus } from '@app/subscriptions/schema/subscription.schema';
import Stripe from 'stripe';

export class SubscriptionDto {
  id: string;
  amount: number;
  currency: string;
  interval: string;
  intervalCount: number;
  status: SubscriptionStatus;
  paymentMethod: string | Stripe.PaymentMethod;
}
