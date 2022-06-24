import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Query,
  BadRequestException,
  HttpCode,
} from '@nestjs/common';
import {
  ApiExcludeEndpoint,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AllowAnonymous } from '@app/decorators/allow-anonymous.decorator';
import { LocalAuthGuard } from '@app/guards/local-auth.guard';
import { AuthService } from '@app/auth/auth.service';
import { LoginDto } from '@app/auth/dto/login.dto';
import { RegisterDto } from '@app/auth/dto/register.dto';
import { InvitationLoginDto } from '@app/auth/dto/invitation-login.dto';
import { JwtRefreshGuard } from '@app/guards/jwt-refresh.guard';
import { TokenDto } from '@app/auth/dto/token.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Auth')
@Controller('auth')
@AllowAnonymous()
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @ApiResponse({ type: TokenDto })
  @ApiUnauthorizedResponse()
  @Post('/login')
  async login(@Request() { user }, @Body() loginDto: LoginDto) {
    return await this.authService.login(user.id);
  }

  @UseGuards(JwtRefreshGuard)
  @ApiResponse({ type: TokenDto })
  @Get('/refresh')
  async refreshToken(@Request() { user }) {
    return await this.authService.login(user.id);
  }

  @ApiResponse({ type: TokenDto })
  @Post('/register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @ApiQuery({ name: 'token' })
  @HttpCode(204)
  @Get('/verify')
  async verify(@Query('token') token: string) {
    if (!(await this.authService.verify(token))) {
      throw new BadRequestException();
    }
  }

  @ApiResponse({ type: TokenDto })
  @Post('/student-register/')
  async registerStudent(@Body() invitationLoginDto: InvitationLoginDto) {
    return await this.authService.registerStudent(
      invitationLoginDto.invitationCode,
    );
  }

  @Get('/google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('/google/redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Request() { user }) {
    return this.authService.googleLogin(user);
  }

  @ApiExcludeEndpoint()
  @Get('/apple')
  @UseGuards(AuthGuard('apple'))
  async appleAuth() {}

  @ApiExcludeEndpoint()
  @Post('/apple/redirect')
  @UseGuards(AuthGuard('apple'))
  async appleAuthRedirect(@Request() { user }) {
    return user;
  }
}
