import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfilesService } from '@app/profiles/profiles.service';
import { ProfilesController } from '@app/profiles/profiles.controller';
import { Profile, ProfileSchema } from '@app/profiles/schema/profile.schema';
import { ProfileMapper } from '@app/profiles/profiles.mapper';
import { UsersModule } from '@app/users/users.module';
import { InvitationsModule } from '@app/invitations/invitations.module';
import { SubscriptionsModule } from '@app/subscriptions/subscriptions.module';
import { MessagingModule } from '@app/messaging/messaging.module';

@Module({
  imports: [
    UsersModule,
    MessagingModule,
    SubscriptionsModule,
    InvitationsModule,
    MongooseModule.forFeature([{ name: Profile.name, schema: ProfileSchema }]),
  ],
  controllers: [ProfilesController],
  providers: [ProfilesService, ProfileMapper],
  exports: [ProfilesService],
})
export class ProfilesModule {}
