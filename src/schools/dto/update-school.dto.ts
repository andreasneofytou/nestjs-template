import { CreateSchoolDto } from '@app/schools/dto/create-school.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateSchoolDto extends PartialType(CreateSchoolDto) {}
