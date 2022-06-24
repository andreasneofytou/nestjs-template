import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsUrl,
  Length,
  Matches,
} from 'class-validator';

export class RegisterDto {
  @AutoMap()
  @IsNotEmpty()
  @ApiProperty()
  @Length(1, 100)
  givenName: string;

  @AutoMap()
  @IsNotEmpty()
  @ApiProperty()
  @Length(1, 100)
  surname: string;

  @AutoMap()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;

  @AutoMap()
  @IsNotEmpty()
  @ApiProperty()
  @IsPhoneNumber()
  phoneNumber: string;

  @AutoMap()
  @IsNotEmpty()
  @ApiProperty()
  @Length(8, 200)
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W])[A-Za-z\d\W]*$/, {
    message: 'Password is too week',
  })
  password: string;

  @AutoMap()
  @ApiProperty()
  @IsOptional()
  @IsUrl()
  profilePictureUrl: string;
}
