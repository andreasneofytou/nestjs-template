import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum PaymentProvider {
  stripe = 'stripe',
}

export type UserPaymentProviderDocument = UserPaymentProvider & Document;

@Schema({ timestamps: true, id: true })
export class UserPaymentProvider {
  @Prop()
  userId: string;

  @Prop()
  gatewayCustomerId: string;

  @Prop()
  paymentProvider: PaymentProvider;
}

export const UserPaymentProviderSchema = SchemaFactory.createForClass(
  UserPaymentProvider,
).index(
  {
    userId: 1,
    paymentProvider: 1,
  },
  { unique: true },
);
