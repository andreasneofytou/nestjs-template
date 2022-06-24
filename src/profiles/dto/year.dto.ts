import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class YearDto {
  @AutoMap()
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @AutoMap()
  @ApiProperty()
  @IsNotEmpty()
  countryCode: string;
}
