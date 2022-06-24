import { STRIPE_CLIENT } from '@app/stripe/stripe.module';
import {
  CostResponse,
  Product,
} from '@app/subscriptions/dto/cost-response.dto';
import { CouponDto } from '@app/subscriptions/dto/coupon.dto';
import { CreateSubscriptionDto } from '@app/subscriptions/dto/create-subscription.dto';
import { SetupIntentDto } from '@app/subscriptions/dto/setup-intent.dto';
import { SubscriptionDto } from '@app/subscriptions/dto/subscription.dto';
import {
  Subscription,
  SubscriptionDocument,
  SubscriptionStatus,
} from '@app/subscriptions/schema/subscription.schema';
import {
  PaymentProvider,
  UserPaymentProvider,
  UserPaymentProviderDocument,
} from '@app/subscriptions/schema/user-payment-provider.schema';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Stripe from 'stripe';

@Injectable()
export class SubscriptionsService {
  constructor(
    @Inject(STRIPE_CLIENT)
    private readonly stripe: Stripe,
    @InjectModel(Subscription.name)
    private subscriptionModel: Model<SubscriptionDocument>,
    @InjectModel(UserPaymentProvider.name)
    private userPaymentProviderModel: Model<UserPaymentProviderDocument>,
  ) {}

  async createSetupIntent(
    userId: string,
    email: string,
    givenName: string,
    surname: string,
  ): Promise<SetupIntentDto> {
    let { gatewayCustomerId = '' } =
      (await this.userPaymentProviderModel.findOne({ userId }).exec()) || {};

    if (!gatewayCustomerId) {
      const stripeCustomer = await this.stripe.customers.create({
        email,
        name: `${givenName} ${surname}`,
      });

      if (stripeCustomer) {
        gatewayCustomerId = stripeCustomer.id;
        await this.userPaymentProviderModel.create({
          userId,
          gatewayCustomerId,
          paymentProvider: PaymentProvider.stripe,
        });
      }
    }

    const setupIntent = await this.stripe.setupIntents.create({
      customer: gatewayCustomerId,
    });

    return { clientSecret: setupIntent.client_secret };
  }

  async cancelIncompleteSubscriptions(userId: string) {
    const subs = await this.subscriptionModel.find({ userId }).exec();

    if (!subs) {
      throw new NotFoundException();
    }

    for (let sub of subs) {
      if (sub.status === SubscriptionStatus.incomplete) {
        const stripeSubscription = await this.stripe.subscriptions.del(
          sub.subscriptionId,
        );
        sub.status = stripeSubscription.status as SubscriptionStatus;
      }
      sub.save();
    }
  }

  async createSubscriptions(
    userId: string,
    createSubscriptionDtos: CreateSubscriptionDto[],
    paymentMethod: string,
    coupon: string,
  ) {
    const gatewayCustomerId = await this.getCustomersStripeId(userId);
    const subscriptions: Subscription[] = [];

    for (const subDto of createSubscriptionDtos) {
      const sub = await this.stripe.subscriptions.create({
        customer: gatewayCustomerId,
        items: [{ price: subDto.priceId }],
        default_payment_method: paymentMethod,
        coupon,
      });
      subscriptions.push({
        userId,
        gatewayCustomerId,
        learnerId: subDto.learnerId,
        created: new Date(sub.created),
        currentPeriodEnd: new Date(sub.current_period_end),
        currentPeriodStart: new Date(sub.current_period_start),
        productId: subDto.productId,
        priceId: subDto.priceId,
        status: sub.status as SubscriptionStatus,
        subscriptionId: sub.id,
      });
    }

    return this.subscriptionModel.insertMany(subscriptions);
  }

  async calculateCost(exams: string[][]): Promise<CostResponse> {
    const products: Product[] = [];
    for (const ex of exams) {
      const prod = await this.getSubscriptionForProfile(ex);
      const price = await this.stripe.prices.retrieve(
        prod.default_price as string,
      );
      products.push({
        id: prod.id,
        currency: price.currency,
        description: prod.description,
        name: prod.name,
        price: price.unit_amount / 100,
      });
    }

    const costResponse: CostResponse = {
      totalItems: products.length,
      currency: products[0].currency,
      products,
      totalPrice: products
        .map((p) => p.price)
        .reduce((previous, current) => previous + current),
    };

    return costResponse;
  }

  async getSubscriptionForProfile(
    exams: string | string[],
  ): Promise<Stripe.Product> {
    const exam = Array.isArray(exams) ? exams.pop() : exams;

    let { data } = await this.stripe.products.search({
      query: `metadata[\'exams\']: \'${exam}\'`,
    });

    if (!data.length) {
      ({ data } = await this.stripe.products.search({
        query: "metadata['default']: 'true'",
      }));
    }
    return data.pop();
  }

  async getSubscriptions(
    userId: string,
  ): Promise<SubscriptionDto[] | undefined> {
    const stripeCustomerId = await this.getCustomersStripeId(userId);

    const subscriptions =
      (
        await this.stripe.subscriptions.list({
          customer: stripeCustomerId,
          limit: 5,
        })
      ).data || [];

    if (!subscriptions.length) {
      throw new NotFoundException('Subscription not found');
    }

    return subscriptions.map((subscription) => {
      return {
        amount: subscription['plan']['amount'],
        currency: subscription['plan']['currency'],
        id: subscription.id,
        interval: subscription['plan']['interval'],
        intervalCount: subscription['plan']['interval_count'],
        status: subscription.status as SubscriptionStatus,
        paymentMethod: subscription.default_payment_method,
      };
    });
  }

  getSubscription(subscriptionId: string) {
    return this.subscriptionModel.findOne({ subscriptionId }).exec();
  }

  getUserPaymentPoviderByGatewayId(
    gatewayCustomerId: string,
    paymentProvider: PaymentProvider,
  ) {
    return this.userPaymentProviderModel.findOne({
      gatewayCustomerId,
      paymentProvider,
    });
  }

  async getPaymentMethods(userId: string) {
    const stripeCustomerId = await this.getCustomersStripeId(userId);
    const subscriptions = await this.getSubscriptions(userId);
    //TODO:
    return (
      await this.stripe.customers.listPaymentMethods(stripeCustomerId, {
        type: 'card',
      })
    ).data.map(({ card }) => {
      return {
        brand: card.brand,
        last4: card.last4,
        expiryDate: `${card.exp_month.toString().padStart(2, '0')}/${
          card.exp_year
        }`,
        expiryYear: card.exp_year,
        expiryMonth: card.exp_month,
        isDefaultPaymentMethod: true,
      };
    });
  }

  async deletePaymentMethod(paymentMethodId: string, userId: string) {
    const stripeCustomerId = await this.getCustomersStripeId(userId);

    const subscriptions = await this.stripe.subscriptions.list({
      customer: stripeCustomerId,
    });

    if (
      subscriptions.data.findIndex(
        (s) => s.default_payment_method === paymentMethodId,
      ) > -1
    ) {
      throw new NotFoundException('Payment method attached to a subsciption');
    }

    const paymentMethods =
      (
        await this.stripe.customers.listPaymentMethods(stripeCustomerId, {
          type: 'card',
        })
      )?.data || [];

    if (paymentMethods.length < 2) {
      throw new BadRequestException(
        'Customer must have at least 1 active payment method',
      );
    }

    return this.stripe.paymentMethods.detach(paymentMethodId);
  }

  async findOneBy(query: any): Promise<SubscriptionDocument> {
    return this.subscriptionModel.findOne(query);
  }

  async validateCoupon(couponCode: string): Promise<CouponDto> {
    const { data } = await this.stripe.promotionCodes.list({
      code: couponCode,
      active: true,
    });
    const { coupon: stripeCoupon = null } = data.pop() ?? {};

    if (!stripeCoupon) {
      return null;
    }

    return {
      id: stripeCoupon.id,
      amountOff: stripeCoupon.amount_off / 100,
      currency: stripeCoupon.currency,
      name: stripeCoupon.name,
      percentOff: stripeCoupon.percent_off,
      isValid: stripeCoupon.valid,
    };
  }

  private async getCustomersStripeId(userId: string): Promise<string> {
    const { gatewayCustomerId = '' } =
      (await this.userPaymentProviderModel.findOne({ userId }).exec()) || {};

    if (!gatewayCustomerId) {
      throw new NotFoundException('Stripe customer not found');
    }
    return gatewayCustomerId;
  }
}
