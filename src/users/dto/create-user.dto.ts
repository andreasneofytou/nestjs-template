import { LoginProvider } from '@app/users/schema/user.schema';
import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsUrl,
  Length,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @AutoMap()
  @IsNotEmpty()
  @ApiProperty()
  @Length(2, 20)
  givenName: string;

  @AutoMap()
  @IsNotEmpty()
  @ApiProperty()
  @Length(2, 20)
  surname: string;

  @AutoMap()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email?: string;

  @AutoMap()
  @IsNotEmpty()
  @ApiProperty()
  @IsPhoneNumber()
  phoneNumber?: string;

  @AutoMap()
  @IsNotEmpty()
  @ApiProperty()
  @Length(8, 200)
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W])[A-Za-z\d\W]*$/, {
    message: 'Password is too week',
  })
  password?: string;

  @AutoMap()
  @ApiProperty()
  @IsOptional()
  @IsUrl()
  profilePictureUrl?: string;

  @AutoMap()
  @ApiProperty()
  @IsOptional()
  username: string;

  roles: string[];

  isActivated: boolean;

  isVerified: boolean;

  isCompleted: boolean;

  permissions: string[];

  resetPassword?: boolean;
}
