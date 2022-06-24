import { PartialType } from '@nestjs/swagger';
import { CreateSubscriptionDto } from '@app/subscriptions/dto/create-subscription.dto';
import { IsNotEmpty } from 'class-validator';
import { SubscriptionStatus } from '@app/subscriptions/schema/subscription.schema';

export class UpdateSubsciptionDto extends PartialType(CreateSubscriptionDto) {
  @IsNotEmpty()
  status: SubscriptionStatus;

  @IsNotEmpty()
  stripeSubscriptionId: string;

  created?: Date;

  currentPeriodEnd?: Date;

  currentPeriodStart?: Date;
}
