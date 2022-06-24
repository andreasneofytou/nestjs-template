import { SchoolsService } from '@app/schools/schools.service';
import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';
import * as SCHOOL_YEAR_DATA from '@app/seed/data/school-years.json';
import * as UK_SCHOOL_DATA from '@app/seed/data/uk-schools.json';
import * as UK_EXAMS_DATA from '@app/seed/data/uk-school-exams.json';
import { CreateSchoolDto } from '@app/schools/dto/create-school.dto';

@Injectable()
export class SchoolSeed {
  constructor(private readonly schoolsService: SchoolsService) {}

  @Command({ command: 'create:schoolYears', describe: 'Create school years' })
  async createSchoolYears() {
    await this.schoolsService.deleteAllSchoolYears();
    const years = await this.schoolsService.createSchoolYears(SCHOOL_YEAR_DATA);
  }

  @Command({ command: 'create:schools', describe: 'Create schools' })
  async createSchools() {
    await this.schoolsService.deleteAllSchools();
    if (Array.isArray(UK_SCHOOL_DATA)) {
      const schools = UK_SCHOOL_DATA.map<CreateSchoolDto>((x) => {
        return {
          ...x,
          closeDate: !x.closeDate ? undefined : new Date(x.closeDate),
          openDate: !x.openDate ? undefined : new Date(x.openDate),
        };
      });
      await this.schoolsService.createSchools(schools);
    }
  }

  @Command({ command: 'create:exams', describe: 'Create exams' })
  async createExams() {
    await this.schoolsService.deleteAllExams();
    if (Array.isArray(UK_EXAMS_DATA)) {
      await this.schoolsService.createExams(UK_EXAMS_DATA);
    }
  }
}
