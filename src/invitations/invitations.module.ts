import { Module } from '@nestjs/common';
import { InvitationsService } from '@app/invitations/invitations.service';
import { InvitationsController } from '@app/invitations/invitations.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Invitation,
  InvitationSchema,
} from '@app/invitations/schema/invitation.schema';
import { UsersModule } from '@app/users/users.module';
import { InvitationsMapper } from '@app/invitations/invitations.mapper';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      { name: Invitation.name, schema: InvitationSchema },
    ]),
  ],
  controllers: [InvitationsController],
  providers: [InvitationsService, InvitationsMapper],
  exports: [InvitationsService],
})
export class InvitationsModule {}
