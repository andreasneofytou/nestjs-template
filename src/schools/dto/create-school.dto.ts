import { AutoMap } from '@automapper/classes';

export class CreateSchoolDto {
  @AutoMap()
  urn: number;

  @AutoMap()
  localAuthorityName: string;

  @AutoMap()
  localAuthorityNumber: number;

  @AutoMap()
  establishmentNumber: number;

  @AutoMap()
  localAuthorityEstablishmentNumber: number;

  @AutoMap()
  name: string;

  @AutoMap()
  priority: boolean;

  @AutoMap()
  examType: string;

  @AutoMap()
  pastPapersAvailable: boolean;

  @AutoMap()
  street: string;

  @AutoMap()
  locality: string;

  @AutoMap()
  address3: string;

  @AutoMap()
  town: string;

  @AutoMap()
  postcode: string;

  @AutoMap()
  status: string;

  @AutoMap()
  openDate?: Date;

  @AutoMap()
  closeDate?: Date;

  @AutoMap()
  minorGroup: string;

  @AutoMap()
  type: string;

  @AutoMap()
  isPrimary: boolean;

  @AutoMap()
  isSecondary: boolean;

  @AutoMap()
  isPost16: boolean;

  @AutoMap()
  ageLow: number;

  @AutoMap()
  ageHigh: number;

  @AutoMap()
  gender: string;

  @AutoMap()
  religiousCharacter: string;

  @AutoMap()
  admissionsPolicy: string;

  @AutoMap()
  ofstedRating: string;

  @AutoMap()
  ofstedLastInspection: string;
}
