import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum SubscriptionStatus {
  active = 'active',
  past_due = 'past_due',
  unpaid = 'unpaid',
  canceled = 'canceled',
  incomplete = 'incomplete',
  incomplete_expired = 'incomplete_expired',
  trialing = 'trialing',
}

export type SubscriptionDocument = Subscription & Document;

@Schema({ timestamps: true, id: true })
export class Subscription {
  @Prop()
  userId: string;

  @Prop()
  gatewayCustomerId: string;

  @Prop()
  subscriptionId: string;

  @Prop()
  productId: string;

  @Prop()
  priceId: string;

  @Prop()
  learnerId: string;

  @Prop({ type: () => Date })
  created: Date;

  @Prop({ type: () => Date })
  currentPeriodEnd: Date;

  @Prop({ type: () => Date })
  currentPeriodStart: Date;

  @Prop({ enum: SubscriptionStatus })
  status: SubscriptionStatus;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
