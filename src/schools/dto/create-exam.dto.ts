import { AutoMap } from '@automapper/classes';

export class CreateExamDto {
  @AutoMap()
  name: string;

  @AutoMap()
  examDate?: Date;
}
