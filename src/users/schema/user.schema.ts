import { AutoMap } from '@automapper/classes';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum LoginProvider {
  local = 'local',
  google = 'google',
  apple = 'apple',
}

export enum UserRoles {
  admin = 'admin',
  customer = 'customer',
  learner = 'learner',
}

export enum UserPermissions {
  canUploadProfilePicture = 'canUploadProfilePicture',
  canStudyWithFriends = 'canStudyWithFriends',
  canUseRealName = 'canUseRealName',
}

export type UserDocument = User & Document;

@Schema({ timestamps: true, id: true })
export class User {
  @AutoMap()
  @Prop()
  givenName: string;

  @AutoMap()
  @Prop()
  surname: string;

  @AutoMap()
  @Prop({ unique: true })
  username: string;

  @AutoMap()
  @Prop({ unique: true, sparse: true })
  email?: string;

  @AutoMap()
  @Prop({ unique: true, sparse: true })
  phoneNumber?: string;

  @Prop()
  password: string;

  @Prop()
  @AutoMap()
  profilePictureUrl: string;

  @AutoMap(() => [String])
  @Prop([String])
  roles: string[];

  @AutoMap()
  @Prop({ default: false })
  isActivated: boolean;

  @AutoMap()
  @Prop({ default: false })
  isVerified: boolean;

  @AutoMap()
  @Prop({ default: false })
  isCompleted: boolean;

  @AutoMap(() => [String])
  @Prop([String])
  permissions: string[];

  @Prop({ default: false })
  resetPassword: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
