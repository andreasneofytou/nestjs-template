import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { MapInterceptor } from '@automapper/nestjs';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from '@app/users/users.service';
import { CreateUserDto } from '@app/users/dto/create-user.dto';
import { UpdateUserDto } from '@app/users/dto/update-user.dto';
import { UserDto } from '@app/users/dto/user.dto';
import { User } from '@app/users/schema/user.schema';
import { AllowAnonymous } from '@app/decorators/allow-anonymous.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiResponse({ type: UserDto })
  @Post()
  @UseInterceptors(MapInterceptor(User, UserDto))
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @AllowAnonymous()
  @Get('check-email/:email')
  async checkEmail(@Param('email') email: string) {
    const isTaken = await this.usersService.isEmailTaken(email);
    return {
      isTaken,
    };
  }

  @AllowAnonymous()
  @Get('check-phone/:phoneNumber')
  async checkPhoneNumber(@Param('phoneNumber') phoneNumber: string) {
    const isTaken = await this.usersService.isPhoneNumberTaken(phoneNumber);
    return {
      isTaken,
    };
  }

  @AllowAnonymous()
  @Get('check-username/:username')
  async checkUsername(@Param('username') username: string) {
    const isTaken = await this.usersService.isUsernameTaken(username);
    return {
      isTaken,
    };
  }

  @AllowAnonymous()
  @Get('generate-username')
  async generateUsername() {
    const username = await this.usersService.generateUsername();
    return { username };
  }

  @Patch()
  @UseInterceptors(MapInterceptor(User, UserDto))
  async update(@Request() { user }, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(user.id, updateUserDto);
  }
}
