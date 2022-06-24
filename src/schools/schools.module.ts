import { Module } from '@nestjs/common';
import { SchoolsService } from '@app/schools/schools.service';
import { SchoolsController } from '@app/schools/schools.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { School, SchoolSchema } from '@app/schools/schema/school.schema';
import {
  SchoolYear,
  SchoolYearSchema,
} from '@app/schools/schema/school-year.schema';
import { SchoolsMapper } from '@app/schools/schools.mapper';
import { Exam, ExamSchema } from '@app/schools/schema/exam.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: School.name, schema: SchoolSchema },
      { name: SchoolYear.name, schema: SchoolYearSchema },
      { name: Exam.name, schema: ExamSchema },
    ]),
  ],
  controllers: [SchoolsController],
  providers: [SchoolsService, SchoolsMapper],
  exports: [SchoolsService, SchoolsMapper],
})
export class SchoolsModule {}
