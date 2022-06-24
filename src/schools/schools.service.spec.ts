import { Test, TestingModule } from '@nestjs/testing';
import { SchoolsService } from '@app/schools/schools.service';
import { getModelToken } from '@nestjs/mongoose';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { School } from '@app/schools/schema/school.schema';
import { SchoolYear } from '@app/schools/schema/school-year.schema';
import { Exam } from '@app/schools/schema/exam.schema';

const moduleMocker = new ModuleMocker(global);
describe('SchoolsService', () => {
  let service: SchoolsService;

  function mockSchoolModel(dto: any) {
    this.data = dto;
    this.save = () => {
      return this.data;
    };
  }

  function mockExamModel(dto: any) {
    this.data = dto;
    this.save = () => {
      return this.data;
    };
  }

  function mockSchoolYearModel(dto: any) {
    this.data = dto;
    this.save = () => {
      return this.data;
    };
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SchoolsService,
        {
          provide: getModelToken(School.name),
          useValue: mockSchoolModel,
        },
        {
          provide: getModelToken(SchoolYear.name),
          useValue: mockSchoolYearModel,
        },
        {
          provide: getModelToken(Exam.name),
          useValue: mockExamModel,
        },
      ],
    })
      .useMocker((token) => {
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(
            token,
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    service = module.get<SchoolsService>(SchoolsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});