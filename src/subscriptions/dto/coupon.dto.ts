import { ApiProperty } from '@nestjs/swagger';

export class CouponDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  amountOff: Number;
  @ApiProperty()
  currency: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  percentOff: Number;
  @ApiProperty()
  isValid: boolean;
}
