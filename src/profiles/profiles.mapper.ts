import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  mapWith,
} from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { Profile, School } from '@app/profiles/schema/profile.schema';
import { LearnerProfileDto } from '@app/profiles/dto/learner-profile.dto';
import { SchoolDto } from '@app/profiles/dto/school.dto';

@Injectable()
export class ProfileMapper extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(mapper, School, SchoolDto);
      createMap(
        mapper,
        Profile,
        LearnerProfileDto,
        forMember(
          (p) => p.currentSchool,
          mapWith(SchoolDto, School, (source) => source.currentSchool),
        ),
        forMember(
          (p) => p.targetSchools,
          mapWith(SchoolDto, School, (source) => source.targetSchools),
        ),
      );
    };
  }
}
