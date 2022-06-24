import { AutoMap } from '@automapper/classes';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SchoolDocument = School & Document;

@Schema()
export class School {
  @Prop()
  @AutoMap()
  urn: number;

  @Prop()
  @AutoMap()
  localAuthorityName: string;

  @Prop()
  @AutoMap()
  localAuthorityNumber: number;

  @Prop()
  @AutoMap()
  establishmentNumber: number;

  @Prop()
  @AutoMap()
  localAuthorityEstablishmentNumber: number;

  @Prop()
  @AutoMap()
  name: string;

  @Prop()
  @AutoMap()
  priority: boolean;

  @Prop()
  @AutoMap()
  examType: string;

  @Prop()
  @AutoMap()
  pastPapersAvailable: boolean;

  @Prop()
  @AutoMap()
  street: string;

  @Prop()
  @AutoMap()
  locality: string;

  @Prop()
  @AutoMap()
  address3: string;

  @Prop()
  @AutoMap()
  town: string;

  @Prop()
  @AutoMap()
  postcode: string;

  @Prop()
  @AutoMap()
  status: string;

  @Prop()
  @AutoMap()
  openDate?: Date;

  @Prop()
  @AutoMap()
  closeDate?: Date;

  @Prop()
  @AutoMap()
  minorGroup: string;

  @Prop()
  @AutoMap()
  type: string;

  @Prop()
  @AutoMap()
  isPrimary: boolean;

  @Prop()
  @AutoMap()
  isSecondary: boolean;

  @Prop()
  @AutoMap()
  isPost16: boolean;

  @Prop()
  @AutoMap()
  ageLow: number;

  @Prop()
  @AutoMap()
  ageHigh: number;

  @Prop()
  @AutoMap()
  gender: string;

  @Prop()
  @AutoMap()
  religiousCharacter: string;

  @Prop()
  @AutoMap()
  admissionsPolicy: string;

  @Prop()
  @AutoMap()
  ofstedRating: string;

  @Prop()
  @AutoMap()
  ofstedLastInspection: string;
}

export const SchoolSchema = SchemaFactory.createForClass(School);
