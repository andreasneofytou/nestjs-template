import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class InvitationLoginDto {
  @IsNotEmpty()
  @ApiProperty()
  invitationCode: string;
}
