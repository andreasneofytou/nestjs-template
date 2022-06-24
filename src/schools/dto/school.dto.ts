import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

export class SchoolDto {
  @ApiProperty()
  @AutoMap()
  urn: number;

  @ApiProperty()
  @AutoMap()
  localAuthorityName: string;

  @ApiProperty()
  @AutoMap()
  localAuthorityNumber: number;

  @ApiProperty()
  @AutoMap()
  establishmentNumber: number;

  @ApiProperty()
  @AutoMap()
  localAuthorityEstablishmentNumber: number;

  @ApiProperty()
  @AutoMap()
  name: string;

  @ApiProperty()
  @AutoMap()
  priority: boolean;

  @ApiProperty()
  @AutoMap()
  examType: string;

  @ApiProperty()
  @AutoMap()
  pastPapersAvailable: boolean;

  @ApiProperty()
  @AutoMap()
  street: string;

  @ApiProperty()
  @AutoMap()
  locality: string;

  @ApiProperty()
  @AutoMap()
  address3: string;

  @ApiProperty()
  @AutoMap()
  town: string;

  @ApiProperty()
  @AutoMap()
  postcode: string;

  @ApiProperty()
  @AutoMap()
  status: string;

  @ApiProperty()
  @AutoMap()
  openDate: Date;

  @ApiProperty()
  @AutoMap()
  closeDate: Date;

  @ApiProperty()
  @AutoMap()
  minorGroup: string;

  @ApiProperty()
  @AutoMap()
  type: string;

  @ApiProperty()
  @AutoMap()
  isPrimary: boolean;

  @ApiProperty()
  @AutoMap()
  isSecondary: boolean;

  @ApiProperty()
  @AutoMap()
  isPost16: boolean;

  @ApiProperty()
  @AutoMap()
  ageLow: number;

  @ApiProperty()
  @AutoMap()
  ageHigh: number;

  @ApiProperty()
  @AutoMap()
  gender: string;

  @ApiProperty()
  @AutoMap()
  religiousCharacter: string;

  @ApiProperty()
  @AutoMap()
  admissionsPolicy: string;

  @ApiProperty()
  @AutoMap()
  ofstedRating: string;

  @ApiProperty()
  @AutoMap()
  ofstedLastInspection: string;
}
