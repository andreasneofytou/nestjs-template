import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionsController } from '@app/subscriptions/subscriptions.controller';
import { SubscriptionsService } from '@app/subscriptions/subscriptions.service';
import { getModelToken } from '@nestjs/mongoose';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { STRIPE_CLIENT } from '@app/stripe/stripe.module';
import Stripe from 'stripe';

const moduleMocker = new ModuleMocker(global);

describe('SubscriptionsController', () => {
  let controller: SubscriptionsController;

  beforeEach(async () => {
    function mockSubscriptionModel(dto: any) {
      this.data = dto;
      this.save = () => {
        return this.data;
      };
    }

    function mockUserPaymentProviderModel(dto: any) {
      this.data = dto;
      this.save = () => {
        return this.data;
      };
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubscriptionsController],
      providers: [
        SubscriptionsService,
        {
          provide: STRIPE_CLIENT,
          useValue: new Stripe('', { apiVersion: '2020-08-27' }),
        },
        {
          provide: getModelToken('Subscription'),
          useValue: mockSubscriptionModel,
        },
        {
          provide: getModelToken('UserPaymentProvider'),
          useValue: mockUserPaymentProviderModel,
        },
      ],
    })
      .useMocker((token) => {
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(
            token,
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    controller = module.get<SubscriptionsController>(SubscriptionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
