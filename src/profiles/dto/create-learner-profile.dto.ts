import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { GenderType } from '@app/profiles/schema/profile.schema';
import { AutoMap } from '@automapper/classes';
import { SchoolDto } from '@app/profiles/dto/school.dto';
import { YearDto } from '@app/profiles/dto/year.dto';
import { UserPermissions } from '@app/users/schema/user.schema';

export class CreateRequest {
  @AutoMap(() => [CreateLearnerProfileDto])
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => CreateLearnerProfileDto)
  learners: CreateLearnerProfileDto[];
}

export class CreateLearnerProfileDto {
  userId: string;

  @AutoMap()
  @IsNotEmpty()
  @IsOptional()
  customerId: string;

  @AutoMap()
  @IsNotEmpty()
  @ApiProperty()
  givenName: string;

  @AutoMap()
  @IsNotEmpty()
  @ApiProperty()
  surname: string;

  @AutoMap()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty()
  @IsPhoneNumber()
  phoneNumber?: string;

  @AutoMap()
  @ApiProperty()
  @IsOptional()
  @IsEmail()
  email?: string;

  @AutoMap(() => Date)
  @IsNotEmpty()
  @IsDateString()
  @ApiProperty()
  dob: Date;

  @AutoMap()
  @IsNotEmpty()
  @ApiProperty()
  currentSchool: SchoolDto;

  @AutoMap()
  @IsNotEmpty()
  @ApiProperty()
  grade: YearDto;

  @AutoMap()
  @IsNotEmpty()
  @ApiProperty({ enum: [GenderType.male, GenderType.female, GenderType.other] })
  gender: GenderType;

  @AutoMap()
  @ApiProperty()
  @IsOptional()
  referralCode: string;

  @AutoMap(() => [SchoolDto])
  @IsNotEmpty()
  @ApiProperty({ isArray: true, type: () => SchoolDto })
  @IsArray()
  @ValidateNested({ each: true })
  targetSchools: SchoolDto[];

  @AutoMap(() => [String])
  @IsNotEmpty()
  @ApiProperty({ isArray: true, type: () => String })
  @IsArray()
  @IsNotEmpty()
  exams: string[];

  @AutoMap()
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isEnglishSecondLanguage?: boolean;

  @AutoMap(() => [String])
  @ApiProperty({ isArray: true, type: () => String })
  @IsArray()
  @IsOptional()
  specialEducationNeeds?: string[];

  @AutoMap()
  @ApiProperty({
    isArray: true,
    enum: [
      UserPermissions.canStudyWithFriends,
      UserPermissions.canUploadProfilePicture,
      UserPermissions.canUseRealName,
    ],
  })
  @IsEnum(UserPermissions, { each: true })
  @IsOptional()
  permissions?: UserPermissions[];

  @AutoMap()
  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isHomeschooled: boolean;

  @AutoMap()
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isNotificationsEnable: boolean;
}
