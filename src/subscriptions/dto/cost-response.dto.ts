import { ApiProperty } from '@nestjs/swagger';

export class CostResponse {
  @ApiProperty()
  totalPrice: number;
  @ApiProperty()
  totalItems: number;
  @ApiProperty()
  currency: string;
  @ApiProperty({ type: () => Product, isArray: true })
  products: Product[];
}

export class Product {
  @ApiProperty()
  id: string;
  @ApiProperty()
  price: number;
  @ApiProperty()
  currency: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
}
