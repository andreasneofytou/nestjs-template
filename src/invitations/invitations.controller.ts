import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateInvitationDto } from '@app/invitations/dto/create-invitation.dto';
import { InvitationsService } from '@app/invitations/invitations.service';
import { InvitationDto } from '@app/invitations/dto/invitation.dto';
import { MapInterceptor } from '@automapper/nestjs';
import { Invitation } from '@app/invitations/schema/invitation.schema';

@ApiBearerAuth()
@ApiTags('Invitations')
@Controller('invitations')
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @Post()
  async create(@Body() createInvitationDto: CreateInvitationDto) {
    return this.invitationsService.create(createInvitationDto);
  }

  @ApiResponse({ type: InvitationDto, isArray: true })
  @UseInterceptors(MapInterceptor(Invitation, InvitationDto, { isArray: true }))
  @Get()
  async getByInviter(@Request() { user }) {
    return this.invitationsService.getByInviterId(user.id);
  }
}
