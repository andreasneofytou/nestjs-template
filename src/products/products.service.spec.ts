import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from '@app/products/products.service';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import Stripe from 'stripe';
import { STRIPE_CLIENT } from '@app/stripe/stripe.module';

const moduleMocker = new ModuleMocker(global);

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const stripe = new Stripe('', { apiVersion: '2020-08-27' });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: STRIPE_CLIENT,
          useValue: stripe,
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

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
