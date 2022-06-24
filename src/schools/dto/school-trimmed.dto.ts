import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

export class SchoolTrimmedDto {
  @ApiProperty()
  @AutoMap()
  urn: number;

  @ApiProperty()
  @AutoMap()
  name: string;
}
