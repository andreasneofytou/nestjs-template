import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionsService } from '@app/subscriptions/subscriptions.service';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { getModelToken } from '@nestjs/mongoose';
import { STRIPE_CLIENT } from '@app/stripe/stripe.module';
import Stripe from 'stripe';

const moduleMocker = new ModuleMocker(global);

describe('SubscriptionsService', () => {
  let service: SubscriptionsService;

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

    service = module.get<SubscriptionsService>(SubscriptionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
