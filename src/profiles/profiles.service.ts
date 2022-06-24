import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateLearnerProfileDto } from '@app/profiles/dto/create-learner-profile.dto';
import {
  Profile,
  ProfileDocument,
  ProfileType,
  SpecialEducationNeeds,
} from '@app/profiles/schema/profile.schema';
import mongoose from 'mongoose';
import { UsersService } from '@app/users/users.service';
import { InvitationsService } from '@app/invitations/invitations.service';
import { CreateInvitationDto } from '@app/invitations/dto/create-invitation.dto';
import { InvitationStatus } from '@app/invitations/schema/invitation.schema';
import * as moment from 'moment';
import { UserRoles } from '@app/users/schema/user.schema';
import { UpdateLearnerProfileDto } from '@app/profiles/dto/update-learner-profile.dto';
import { SubscriptionsService } from '@app/subscriptions/subscriptions.service';
import { CreateSubscriptionDto } from '@app/subscriptions/dto/create-subscription.dto';
import { MessagingService } from '@app/messaging/messaging.service';
import { LocalUser } from '@app/auth/dto/local-user';

@Injectable()
export class ProfilesService {
  private readonly logger = new Logger(ProfilesService.name);

  constructor(
    @InjectConnection() private readonly connection: mongoose.Connection,
    @InjectModel(Profile.name) private profileModel: Model<ProfileDocument>,
    private readonly usersService: UsersService,
    private readonly invitationsService: InvitationsService,
    private readonly subscriptionsService: SubscriptionsService,
    private readonly messagingService: MessagingService,
  ) {}

  async createLearnerProfile(
    createLearnerDto: CreateLearnerProfileDto,
  ): Promise<ProfileDocument> {
    return this.profileModel.create(createLearnerDto);
  }

  async createLearnerProfiles(
    createLearnerDtos: CreateLearnerProfileDto[],
    customer: LocalUser,
    paymentMethod: string,
    coupon: string,
    session?: mongoose.ClientSession,
  ): Promise<ProfileDocument[]> {
    const { id: parentId } = customer;
    this.validateId(parentId);

    session = session || (await this.connection.startSession());
    session.startTransaction();
    let createdProfiles: ProfileDocument[] = [];
    try {
      const profiles: CreateLearnerProfileDto[] = [];
      const invitations: CreateInvitationDto[] = [];

      for (const learnerProfile of createLearnerDtos) {
        const username = await this.usersService.generateUsername();
        const learnerUser = await this.usersService.create(
          {
            givenName: learnerProfile.givenName,
            surname: learnerProfile.surname,
            phoneNumber: learnerProfile.phoneNumber,
            email: learnerProfile.email,
            username,
            roles: [UserRoles.learner],
            isActivated: false,
            isVerified: true,
            isCompleted: true,
            permissions: learnerProfile.permissions,
            resetPassword: true,
          },
          session,
        );
        learnerProfile.userId = learnerUser.id;
        learnerProfile.customerId = parentId;

        profiles.push(learnerProfile);
        invitations.push({
          inviterId: parentId,
          inviteeId: learnerUser.id,
          givenName: learnerUser.givenName,
          surname: learnerProfile.surname,
          createdDate: moment().toDate(),
          expirationDate: moment().add('7', 'days').toDate(),
          status: InvitationStatus.active,
        });
      }
      createdProfiles = await this.profileModel.insertMany(createLearnerDtos, {
        session,
      });
      await this.invitationsService.create(invitations, session);
      await this.createSubscriptions(
        createdProfiles,
        parentId,
        paymentMethod,
        coupon,
      );
      await this.usersService.completeUser(parentId, session);
      await session.commitTransaction();
      await this.messagingService.sendWelcomeEmail(customer);
    } catch (error) {
      await session.abortTransaction();
      this.logger.error(error.message, error.stack);
      throw error;
    } finally {
      session.endSession();
    }

    return createdProfiles;
  }

  private async createSubscriptions(
    profiles: ProfileDocument[],
    parentId: string,
    paymentMethod: string,
    coupon: string,
  ) {
    const createSubsDtos: CreateSubscriptionDto[] = [];

    for (const cp of profiles) {
      const product = await this.subscriptionsService.getSubscriptionForProfile(
        cp.exams.pop() ?? 'default',
      );

      createSubsDtos.push({
        learnerId: cp.userId,
        userId: cp.customerId,
        productId: product.id,
        priceId: (product.default_price as string) ?? '',
      });
    }

    await this.subscriptionsService.createSubscriptions(
      parentId,
      createSubsDtos,
      paymentMethod,
      coupon,
    );
  }

  async findAll(): Promise<ProfileDocument[]> {
    return this.profileModel.find();
  }

  async findCustomerLearners(customerId: string): Promise<ProfileDocument[]> {
    this.validateId(customerId);

    return this.profileModel.find({ customerId });
  }

  async findOne(
    learnerId: string,
    customerId: string,
  ): Promise<ProfileDocument> {
    this.validateId(learnerId);

    return this.profileModel.findOne({ userId: learnerId, customerId });
  }

  async findByUserId(userId: string): Promise<ProfileDocument> {
    this.validateId(userId);

    return this.profileModel.findOne({ userId });
  }

  async update(
    id: string,
    customerId: string,
    updateLearnerProfileDto: UpdateLearnerProfileDto,
  ) {
    this.validateId(id);
    const result = await this.profileModel.updateOne(
      { _id: id, customerId },
      updateLearnerProfileDto,
    );
    if (result.matchedCount === 0) {
      throw new NotFoundException('Profile not found');
    }
  }

  async getSpecialEducationNeeds() {
    return Object.values(SpecialEducationNeeds);
  }

  private validateId(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID');
    }
  }
}
