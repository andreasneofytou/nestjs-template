import { SchoolTrimmedDto } from '@app/schools/dto/school-trimmed.dto';
import { ApiProperty } from '@nestjs/swagger';
export class SchoolResultsDto {
  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalCount: number;

  @ApiProperty({ isArray: true, type: SchoolTrimmedDto })
  results: SchoolTrimmedDto[];
}
