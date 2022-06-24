import { ApiProperty } from '@nestjs/swagger';
import Stripe from 'stripe';

export class ProductDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  active: boolean;
  @ApiProperty()
  description: string;
  @ApiProperty({ type: () => [String] })
  images: string[];
  @ApiProperty()
  name: string;
  @ApiProperty()
  label: string;

  static fromStripeProduct(stripeProduct: Stripe.Product): ProductDto {
    return {
      id: stripeProduct.id,
      active: stripeProduct.active,
      description: stripeProduct.description,
      images: stripeProduct.images,
      label: stripeProduct.unit_label,
      name: stripeProduct.name,
    };
  }
}
