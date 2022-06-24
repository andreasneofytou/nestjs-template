import { AutoMap } from '@automapper/classes';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ExamDocument = Exam & Document;

@Schema({ timestamps: true, id: true })
export class Exam {
  @AutoMap()
  @Prop()
  name: string;

  @AutoMap()
  @Prop({ required: false })
  examDate?: Date;
}

export const ExamSchema = SchemaFactory.createForClass(Exam);
