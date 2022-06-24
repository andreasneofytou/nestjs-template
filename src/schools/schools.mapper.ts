import { ExamDto } from '@app/schools/dto/exam.dto';
import { SchoolTrimmedDto } from '@app/schools/dto/school-trimmed.dto';
import { SchoolYearDto } from '@app/schools/dto/school-year.dto';
import { SchoolDto } from '@app/schools/dto/school.dto';
import { Exam } from '@app/schools/schema/exam.schema';
import { SchoolYear } from '@app/schools/schema/school-year.schema';
import { School } from '@app/schools/schema/school.schema';
import { createMap, Mapper } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SchoolsMapper extends AutomapperProfile {
  constructor(@InjectMapper() public mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(mapper, SchoolYear, SchoolYearDto);
      createMap(mapper, School, SchoolDto);
      createMap(mapper, School, SchoolTrimmedDto);
      createMap(mapper, Exam, ExamDto);
    };
  }
}
