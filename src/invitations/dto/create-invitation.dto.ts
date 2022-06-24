import { InvitationStatus } from '@app/invitations/schema/invitation.schema';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateInvitationDto {
  @ApiProperty()
  @IsNotEmpty()
  inviterId: string;

  @ApiProperty()
  @IsNotEmpty()
  inviteeId: string;

  @ApiProperty()
  @IsNotEmpty()
  givenName: string;

  @ApiProperty()
  @IsNotEmpty()
  surname: string;

  expirationDate: Date;

  status: InvitationStatus;

  createdDate: Date;
}
