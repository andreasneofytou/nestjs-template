import { AutoMap } from '@automapper/classes';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type SchoolYearDocument = SchoolYear & Document;

@Schema()
export class SchoolYear {
  @Prop()
  @AutoMap()
  countryCode: string;

  @Prop()
  @AutoMap()
  name: string;

  @Prop()
  @AutoMap()
  order: number;

  @Prop()
  isEnabled: boolean;
}

export const SchoolYearSchema = SchemaFactory.createForClass(SchoolYear);
