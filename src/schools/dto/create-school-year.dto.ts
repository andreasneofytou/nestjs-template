import { AutoMap } from '@automapper/classes';

export class CreateSchoolYearDto {
  @AutoMap()
  name: string;
  @AutoMap()
  countryCode: string;
  @AutoMap()
  order: number;
}
