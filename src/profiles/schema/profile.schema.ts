import { AutoMap } from '@automapper/classes';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum ProfileType {
  admin,
  customer,
  learner,
}

export enum GenderType {
  male = 'male',
  female = 'female',
  other = 'other',
}

export enum SpecialEducationNeeds {
  dyslexia = 'dyslexia',
  dyspraxia = 'dyspraxia',
}

export type ProfileDocument = Profile & Document;

export class School {
  @AutoMap()
  @Prop()
  name: string;

  @AutoMap()
  @Prop()
  urn: number;
}

export class Year {
  @AutoMap()
  @Prop()
  name: string;

  @AutoMap()
  @Prop()
  countryCode: string;
}

@Schema({ timestamps: true, id: true })
export class Profile {
  @AutoMap()
  @Prop()
  type: ProfileType;

  @AutoMap()
  @Prop({ unique: true })
  userId: string;

  @AutoMap()
  @Prop()
  customerId: string;

  @AutoMap()
  @Prop()
  givenName: string;

  @AutoMap()
  @Prop()
  surname: string;

  @AutoMap()
  @Prop()
  dob: Date;

  @AutoMap()
  @Prop()
  gender: GenderType;

  @AutoMap()
  @Prop()
  referralCode: string;

  @AutoMap()
  @Prop()
  grade: Year;

  @AutoMap()
  @Prop()
  currentSchool: School;

  @AutoMap(() => [School])
  @Prop([School])
  targetSchools: School[];

  @AutoMap(() => [String])
  @Prop([String])
  exams: string[];

  @AutoMap()
  @Prop({ default: false })
  isEnglishSecondLanguage: boolean;

  @AutoMap(() => [String])
  @Prop([String])
  specialEducationNeeds: string[];

  @AutoMap()
  @Prop({ default: false })
  isHomeschooled: boolean;

  @AutoMap()
  @Prop({ default: false })
  isNotificationsEnable: boolean;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
