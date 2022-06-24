import { InvitationDto } from '@app/invitations/dto/invitation.dto';
import { Invitation } from '@app/invitations/schema/invitation.schema';
import { createMap, Mapper } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class InvitationsMapper extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(mapper, Invitation, InvitationDto);
    };
  }
}
