import { AllowAnonymous } from '@app/decorators/allow-anonymous.decorator';
import { STRIPE_SIGNATURE } from '@app/stripe/stripe.module';
import { WebhooksService } from '@app/webhooks/webhooks.service';
import {
  Controller,
  Post,
  Headers,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

@AllowAnonymous()
@ApiExcludeController()
@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('/stripe')
  async stripeUpdate(@Headers() headers, @Request() req) {
    const stripeSingnature = headers[STRIPE_SIGNATURE];

    if (!stripeSingnature) {
      throw new BadRequestException();
    }
    return await this.webhooksService.handleStripeUpdate(
      stripeSingnature,
      req['rawBody'],
    );
  }
}
