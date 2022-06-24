import { CreateLearnerProfileDto } from '@app/profiles/dto/create-learner-profile.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateLearnerProfileDto extends PartialType(
  CreateLearnerProfileDto,
) {}
