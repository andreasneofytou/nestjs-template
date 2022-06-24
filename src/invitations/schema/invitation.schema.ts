import { AutoMap } from '@automapper/classes';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum InvitationStatus {
  active = 'active',
  expired = 'expired',
  used = 'used',
}

export type InvitationDocument = Invitation & Document;

@Schema({ timestamps: true, id: true })
export class Invitation {
  @AutoMap()
  @Prop({ isRequired: true })
  invitationCode: string;

  @AutoMap()
  @Prop({ isRequired: true })
  inviterId: string;

  @AutoMap()
  @Prop({ isRequired: true })
  inviteeId: string;

  @AutoMap()
  @Prop()
  givenName: string;

  @AutoMap()
  @Prop()
  surname: string;

  @AutoMap()
  @Prop()
  expirationDate: Date;

  @AutoMap()
  @Prop()
  status: InvitationStatus;

  @AutoMap()
  @Prop()
  createdDate: Date;
}

export const InvitationSchema = SchemaFactory.createForClass(Invitation).index(
  {
    invitationCode: 1,
  },
  { unique: true },
);
