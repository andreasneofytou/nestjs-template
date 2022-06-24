import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Request,
  Param,
  Query,
  UseInterceptors,
  NotFoundException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProfilesService } from '@app/profiles/profiles.service';
import { Roles } from '@app/decorators/roles.decorator';
import {
  CreateLearnerProfileDto,
  CreateRequest as CreateLearnersRequest,
} from '@app/profiles/dto/create-learner-profile.dto';
import { UserRoles } from '@app/users/schema/user.schema';
import { UpdateLearnerProfileDto } from '@app/profiles/dto/update-learner-profile.dto';
import { AllowAnonymous } from '@app/decorators/allow-anonymous.decorator';
import { MapInterceptor } from '@automapper/nestjs';
import { Profile } from '@app/profiles/schema/profile.schema';
import { LearnerProfileDto } from '@app/profiles/dto/learner-profile.dto';
import { MessagingService } from '@app/messaging/messaging.service';

@ApiBearerAuth()
@ApiTags('Profiles')
@Controller('profiles')
export class ProfilesController {
  constructor(
    private readonly profilesService: ProfilesService,
    private readonly messagingService: MessagingService,
  ) {}

  @Post('/learner')
  @Roles(UserRoles.customer, UserRoles.admin)
  async createLearner(@Body() createLearnerDto: CreateLearnerProfileDto) {
    return this.profilesService.createLearnerProfile(createLearnerDto);
  }

  @ApiBody({ type: CreateLearnersRequest })
  @Post('/learners')
  @Roles(UserRoles.customer, UserRoles.admin)
  async createLearners(
    @Request() { user },
    @Body() createRequest: CreateLearnersRequest,
    @Query('paymentMethod') paymentMethod: string = '',
    @Query('coupon') coupon: string = '',
  ) {
    return this.profilesService.createLearnerProfiles(
      createRequest.learners,
      user,
      paymentMethod,
      coupon,
    );
  }

  @Get('learner')
  @ApiResponse({ type: LearnerProfileDto })
  @UseInterceptors(MapInterceptor(Profile, LearnerProfileDto))
  async getProfile(@Request() { user }) {
    return this.profilesService.findByUserId(user.id);
  }

  @Get('/special-education-needs')
  async getSpecialEducationNeeds() {
    return this.profilesService.getSpecialEducationNeeds();
  }

  @Get('learner/:learnerId')
  @ApiResponse({ type: LearnerProfileDto })
  @UseInterceptors(MapInterceptor(Profile, LearnerProfileDto))
  async findOne(@Request() { user }, @Param('learnerId') learnerId: string) {
    const profile = await this.profilesService.findOne(learnerId, user.id);
    if (!profile) {
      throw new NotFoundException();
    }
    return profile;
  }

  @Patch(':id')
  update(
    @Request() { user },
    @Param('id') id: string,
    @Body() updateLearnerProfileDto: UpdateLearnerProfileDto,
  ) {
    return this.profilesService.update(id, user.id, updateLearnerProfileDto);
  }
}
