import { ApiProperty } from '@nestjs/swagger';

export class SetupIntentDto {
  @ApiProperty()
  clientSecret: string;
}
