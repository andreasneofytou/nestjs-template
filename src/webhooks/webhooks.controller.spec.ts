import { Test, TestingModule } from '@nestjs/testing';
import { WebhooksController } from '@app/webhooks/webhooks.controller';
import { WebhooksService } from '@app/webhooks/webhooks.service';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { STRIPE_CLIENT } from '@app/stripe/stripe.module';
import Stripe from 'stripe';

const moduleMocker = new ModuleMocker(global);

describe('WebhooksController', () => {
  let controller: WebhooksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebhooksController],
      providers: [
        WebhooksService,
        {
          provide: STRIPE_CLIENT,
          useValue: new Stripe('', { apiVersion: '2020-08-27' }),
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
    controller = module.get<WebhooksController>(WebhooksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
