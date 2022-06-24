import { LoginProvider } from '@app/users/schema/user.schema';
import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @AutoMap()
  @ApiProperty()
  id: string;

  @AutoMap()
  @ApiProperty()
  givenName: string;

  @AutoMap()
  @ApiProperty()
  surname: string;

  @AutoMap()
  @ApiProperty()
  username: string;

  @AutoMap()
  @ApiProperty()
  email: string;

  @AutoMap()
  @ApiProperty()
  phoneNumber: string;

  @AutoMap()
  @ApiProperty()
  profilePictureUrl: string;

  @AutoMap(() => [String])
  @ApiProperty({ isArray: true, type: String })
  roles: string[];

  @AutoMap()
  @ApiProperty()
  isActivated: boolean;

  @AutoMap()
  @ApiProperty()
  isVerified: boolean;

  @AutoMap()
  @ApiProperty()
  loginProvider: LoginProvider;
}
