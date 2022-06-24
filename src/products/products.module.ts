import { Module } from '@nestjs/common';
import { ProductsService } from '@app/products/products.service';
import { ProductsController } from '@app/products/products.controller';
import { StripeModule } from '@app/stripe/stripe.module';

@Module({
  imports: [StripeModule],
  providers: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
