import { ProductDto } from '@app/products/dto/product.dto';
import { STRIPE_CLIENT } from '@app/stripe/stripe.module';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class ProductsService {
  constructor(@Inject(STRIPE_CLIENT) private stripe: Stripe) {}

  async getProducts(): Promise<ProductDto[] | undefined> {
    const res = await this.stripe.products.list();
    return res.data.map((p) => ProductDto.fromStripeProduct(p));
  }

  async getProductPrice(id: string): Promise<Stripe.Price> {
    const res = await this.stripe.prices.list({ product: id });
    if (res.data && res.data.length > 0) {
      return res.data.pop();
    }

    throw new NotFoundException();
  }
}
