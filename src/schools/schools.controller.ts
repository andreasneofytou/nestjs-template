import { Roles } from '@app/decorators/roles.decorator';
import { CreateSchoolDto } from '@app/schools/dto/create-school.dto';
import { ExamDto } from '@app/schools/dto/exam.dto';
import { SchoolResultsDto } from '@app/schools/dto/school-results.dto';
import { SchoolYearDto } from '@app/schools/dto/school-year.dto';
import { UpdateSchoolDto } from '@app/schools/dto/update-school.dto';
import { Exam } from '@app/schools/schema/exam.schema';
import { SchoolYear } from '@app/schools/schema/school-year.schema';
import { UserRoles } from '@app/users/schema/user.schema';
import { MapInterceptor } from '@automapper/nestjs';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SchoolsService } from '@app/schools/schools.service';

@ApiBearerAuth()
@ApiTags('Schools')
@Controller('schools')
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}

  @Roles(UserRoles.admin)
  @Post()
  async create(createSchoolDto: CreateSchoolDto) {
    return this.schoolsService.createSchool(createSchoolDto);
  }

  @Roles(UserRoles.admin)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateSchoolDto,
  ) {
    return this.schoolsService.update(id, updateProfileDto);
  }

  @ApiResponse({ type: SchoolResultsDto })
  @Get('search')
  async searchSchool(
    @Query('name') name: string,
    @Query('page') page = 1,
    @Query('limit') limit = 12,
  ) {
    return this.schoolsService.searchSchoolByName(name, +limit, +page);
  }

  @ApiResponse({ type: SchoolResultsDto })
  @Get()
  async getAll(@Query('page') page = 1, @Query('limit') limit = 12) {
    return this.schoolsService.getAll(+limit, +page);
  }

  @UseInterceptors(MapInterceptor(SchoolYear, SchoolYearDto, { isArray: true }))
  @ApiResponse({ type: () => SchoolYearDto, isArray: true })
  @Get('/years')
  async getYears(@Query('country') country: string) {
    return this.schoolsService.findSchoolYearsByCountry(country);
  }

  @UseInterceptors(MapInterceptor(Exam, ExamDto, { isArray: true }))
  @ApiResponse({ type: () => ExamDto, isArray: true })
  @Get('exams')
  async getExamsBySchool() {
    return this.schoolsService.getAllExams();
  }
}
