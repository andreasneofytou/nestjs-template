import { ProductDto } from '@app/products/dto/product.dto';
import { ProductsService } from '@app/products/products.service';
import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiResponse({ type: () => ProductDto, isArray: true })
  @Get()
  async getProducts() {
    return this.productsService.getProducts();
  }

  @ApiParam({ name: 'id' })
  @Get('/:id/price')
  async getProductPrice(@Param('id') id: string) {
    return this.productsService.getProductPrice(id);
  }
}
