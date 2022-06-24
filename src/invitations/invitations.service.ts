import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Invitation,
  InvitationDocument,
  InvitationStatus,
} from '@app/invitations/schema/invitation.schema';
import { CreateInvitationDto } from '@app/invitations/dto/create-invitation.dto';
import mongoose from 'mongoose';

const generateInvCode = () =>
  (Math.floor(Math.random() * 100000) + 100000).toString().slice(1);

@Injectable()
export class InvitationsService {
  private readonly logger = new Logger(InvitationsService.name);

  constructor(
    @InjectModel(Invitation.name)
    private invitationModel: Model<InvitationDocument>,
  ) {}

  private createModel = (dto: CreateInvitationDto): Invitation => {
    const invitation = new this.invitationModel(dto);
    invitation.invitationCode = generateInvCode();
    return invitation;
  };

  async create(
    data: CreateInvitationDto | CreateInvitationDto[],
    session?: mongoose.ClientSession,
  ): Promise<InvitationDocument[]> {
    const packed = Array.isArray(data) ? data : [data];
    const invitations = packed.map(this.createModel);
    return this.invitationModel.insertMany(invitations, { session });
  }

  async findAll(): Promise<Invitation[]> {
    return this.invitationModel.find();
  }

  async getByInviteeId(id: string): Promise<InvitationDocument> {
    return this.invitationModel.findOne({ inviteeId: id });
  }

  async getByInviterId(id: string): Promise<InvitationDocument[]> {
    return this.invitationModel.find({ inviterId: id });
  }

  async findActiveInvitation(
    invitationCode: string,
  ): Promise<InvitationDocument> {
    return this.invitationModel
      .findOne({ invitationCode, status: InvitationStatus.active })
      .exec();
  }

  async markUsedInvitation(id: string) {
    return await this.invitationModel.updateOne(
      { id },
      { status: InvitationStatus.used },
    );
  }
}
