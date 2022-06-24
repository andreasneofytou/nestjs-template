import { GenderType, Year } from '@app/profiles/schema/profile.schema';
import { SchoolDto } from '@app/schools/dto/school.dto';
import { UserPermissions } from '@app/users/schema/user.schema';
import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

export class LearnerProfileDto {
  userId: string;

  @AutoMap()
  @ApiProperty()
  givenName: string;

  @AutoMap()
  @ApiProperty()
  surname: string;

  @AutoMap()
  @ApiProperty()
  phoneNumber: string;

  @AutoMap()
  @ApiProperty()
  email?: string;

  @AutoMap(() => Date)
  @ApiProperty()
  dob: Date;

  @AutoMap(() => SchoolDto)
  @ApiProperty()
  currentSchool: SchoolDto;

  @AutoMap()
  @ApiProperty()
  grade: Year;

  @AutoMap()
  @ApiProperty({ enum: [GenderType.male, GenderType.female, GenderType.other] })
  gender: GenderType;

  @AutoMap()
  @ApiProperty()
  referralCode: string;

  @AutoMap(() => [SchoolDto])
  @ApiProperty({ isArray: true, type: () => SchoolDto })
  targetSchools: SchoolDto[];

  @AutoMap(() => [String])
  @ApiProperty({ isArray: true, type: () => String })
  exams: string[];

  @AutoMap()
  @ApiProperty()
  isEnglishSecondLanguage: boolean;

  @AutoMap()
  @ApiProperty({ isArray: true, type: () => String })
  specialEducationNeeds: string[];

  @AutoMap()
  @ApiProperty({
    isArray: true,
    enum: [
      UserPermissions.canStudyWithFriends,
      UserPermissions.canUploadProfilePicture,
      UserPermissions.canUseRealName,
    ],
  })
  permissions: UserPermissions[];

  @AutoMap()
  @ApiProperty()
  isHomeschooled: boolean;

  @AutoMap()
  @ApiProperty()
  isNotificationsEnable: boolean;
}
