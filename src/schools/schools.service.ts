import { School, SchoolDocument } from '@app/schools/schema/school.schema';
import { Model } from 'mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateSchoolDto } from '@app/schools/dto/create-school.dto';
import { UpdateSchoolDto } from '@app/schools/dto/update-school.dto';
import mongoose from 'mongoose';
import {
  SchoolYear,
  SchoolYearDocument,
} from '@app/schools/schema/school-year.schema';
import { CreateSchoolYearDto } from '@app/schools/dto/create-school-year.dto';
import { Exam, ExamDocument } from '@app/schools/schema/exam.schema';
import { CreateExamDto } from '@app/schools/dto/create-exam.dto';
import { SchoolResultsDto } from '@app/schools/dto/school-results.dto';
import { SchoolsMapper } from '@app/schools/schools.mapper';
import { SchoolTrimmedDto } from '@app/schools/dto/school-trimmed.dto';

const SPECIAL_CHARS_REGEX = /[`~!@#$%^&*()_|+\-=?;"<>\{\}\[\]\\\/]/gi;

@Injectable()
export class SchoolsService {
  constructor(
    @InjectModel(School.name) private schoolModel: Model<SchoolDocument>,
    @InjectModel(Exam.name) private examModel: Model<ExamDocument>,
    @InjectModel(SchoolYear.name)
    private readonly schoolYearModel: Model<SchoolYearDocument>,
    private readonly schoolsMapper: SchoolsMapper,
  ) {}

  async createSchool(
    createSchoolDto: CreateSchoolDto,
  ): Promise<SchoolDocument> {
    return this.schoolModel.create(createSchoolDto);
  }

  async update(id: string, updateSchoolDto: UpdateSchoolDto) {
    this.validateId(id);

    return this.schoolModel.updateOne({ _id: id }, updateSchoolDto);
  }

  async getAll(limit = 12, page = 1): Promise<SchoolResultsDto> {
    const skip = limit * (page - 1);

    const [
      {
        results,
        totalCount: [{ totalCount } = [{}]],
      },
    ] = await this.schoolModel.aggregate([
      {
        $facet: {
          results: [{ $skip: skip }, { $limit: limit }],
          totalCount: [{ $count: 'totalCount' }],
        },
      },
    ]);

    return {
      limit,
      page,
      results: this.schoolsMapper.mapper.mapArray(
        results,
        School,
        SchoolTrimmedDto,
      ),
      totalCount,
    };
  }

  async searchSchoolByName(
    name: string,
    limit = 12,
    page = 1,
  ): Promise<SchoolResultsDto> {
    const trimmedName = name.replace(SPECIAL_CHARS_REGEX, '').trim();
    const skip = limit * (page - 1);
    const query = { name: { $regex: trimmedName, $options: 'i' } };

    const [
      {
        results,
        totalCount: [{ totalCount } = [{}]],
      },
    ] = await this.schoolModel.aggregate([
      {
        $facet: {
          results: [{ $match: query }, { $skip: skip }, { $limit: limit }],
          totalCount: [{ $match: query }, { $count: 'totalCount' }],
          test: [{ $match: { name: { $regex: trimmedName, $options: 'i' } } }],
        },
      },
    ]);

    return {
      limit,
      page,
      results: this.schoolsMapper.mapper.mapArray(
        results,
        School,
        SchoolTrimmedDto,
      ),
      totalCount,
    };
  }

  async getAllExams(): Promise<ExamDocument[]> {
    return this.examModel.find();
  }

  async createSchoolYears(
    createSchoolYearDtos: CreateSchoolYearDto[],
  ): Promise<SchoolYearDocument[]> {
    return this.schoolYearModel.insertMany(createSchoolYearDtos);
  }

  async createSchools(
    createSchoolDtos: CreateSchoolDto[],
  ): Promise<SchoolDocument[]> {
    return this.schoolModel.insertMany(createSchoolDtos);
  }

  async createExams(createExamDtos: CreateExamDto[]): Promise<ExamDocument[]> {
    return this.examModel.insertMany(createExamDtos);
  }

  async findSchoolYearsByCountry(
    countryCode: string,
    onlyEnabled = true,
  ): Promise<SchoolYearDocument[]> {
    if (!countryCode) {
      return [];
    }
    const query = {
      countryCode: countryCode.toUpperCase(),
    };

    if (onlyEnabled) {
      query['isEnabled'] = true;
    }

    return this.schoolYearModel.find(query);
  }

  async deleteAllSchoolYears() {
    return this.schoolYearModel.deleteMany();
  }

  async deleteAllSchools() {
    return this.schoolModel.deleteMany();
  }

  async deleteAllExams() {
    return this.examModel.deleteMany();
  }

  private validateId(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID');
    }
  }
}
