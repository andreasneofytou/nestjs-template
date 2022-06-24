import {
  Request,
  Controller,
  Get,
  Param,
  Delete,
  Post,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { SubscriptionsService } from '@app/subscriptions/subscriptions.service';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CostResponse } from '@app/subscriptions/dto/cost-response.dto';
import { SetupIntentDto } from '@app/subscriptions/dto/setup-intent.dto';
import { SubscriptionDto } from '@app/subscriptions/dto/subscription.dto';
import { CouponDto } from '@app/subscriptions/dto/coupon.dto';

@ApiBearerAuth()
@ApiTags('Subscriptions')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @ApiResponse({ type: SetupIntentDto })
  @Get('/create-setup-intent')
  async createSetupIntent(@Request() { user }) {
    const { id, givenName, surname, email } = user;
    return this.subscriptionsService.createSetupIntent(
      id,
      email,
      givenName,
      surname,
    );
  }

  @Get('/cancel-subscriptions')
  async cancelSubscriptions(@Request() { user }) {
    return this.subscriptionsService.cancelIncompleteSubscriptions(user.id);
  }

  @ApiResponse({ type: CostResponse })
  @ApiBody({ type: [String], isArray: true })
  @Post('/calculate-cost')
  async calculateCost(@Body() exams: string[][]) {
    return this.subscriptionsService.calculateCost(exams);
  }

  @ApiResponse({ type: SubscriptionDto, isArray: true })
  @Get()
  async getSubscriptions(@Request() { user }) {
    return this.subscriptionsService.getSubscriptions(user.id);
  }

  @Get('/payment-methods')
  async getPaymentMethods(@Request() { user }) {
    return this.subscriptionsService.getPaymentMethods(user.id);
  }

  @Delete('/payment-methods/:paymentMethodId')
  async deletePaymentMethod(
    @Request() { user },
    @Param('paymentMethodId') paymentMethodId: string,
  ) {
    return this.subscriptionsService.deletePaymentMethod(
      paymentMethodId,
      user.id,
    );
  }

  @ApiResponse({ type: CouponDto })
  @Get('/validate-coupon/:couponCode')
  async validateCoupon(@Param('couponCode') couponCode: string) {
    const coupon = await this.subscriptionsService.validateCoupon(couponCode);
    if (!coupon) {
      throw new NotFoundException();
    }

    return coupon;
  }
}
