import { InvitationStatus } from '@app/invitations/schema/invitation.schema';
import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

export class InvitationDto {
  @AutoMap()
  @ApiProperty()
  invitationCode: string;

  @AutoMap()
  @ApiProperty()
  givenName: string;

  @AutoMap()
  @ApiProperty()
  surname: string;

  @AutoMap()
  @ApiProperty()
  expirationDate: Date;

  @AutoMap()
  @ApiProperty()
  status: InvitationStatus;

  @AutoMap()
  @ApiProperty()
  createdDate: Date;
}
