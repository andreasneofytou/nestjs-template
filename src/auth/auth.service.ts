import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { CreateUserDto } from '@app/users/dto/create-user.dto';
import { UsersService } from '@app/users/users.service';
import { RegisterDto } from '@app/auth/dto/register.dto';
import { UsersMapper } from '@app/users/users.mapper';
import { JwtConfig } from '@app/app.config';
import { ConfigService } from '@nestjs/config';
import { TokenDto } from '@app/auth/dto/token.dto';
import {
  LoginProvider,
  UserDocument,
  UserRoles,
} from '@app/users/schema/user.schema';
import { GoogleUserDto } from '@app/auth/dto/google-user.dto';
import { TokenPayload } from '@app/auth/dto/token-payload';

@Injectable()
export class AuthService {
  private jwtConfig: JwtConfig;
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly usersMapper: UsersMapper,
    configService: ConfigService,
  ) {
    this.jwtConfig = configService.get<JwtConfig>('jwt');
  }

  async validateUser(
    username: string,
    password: string,
  ): Promise<any | undefined> {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      this.logger.debug('Could not find user');
      throw new UnauthorizedException();
    }

    const isPasswordMatch = await compare(password, user.password);

    if (isPasswordMatch) {
      return user;
    }
    return null;
  }

  async login(
    userId: string,
    loginProvider: LoginProvider = LoginProvider.local,
  ): Promise<TokenDto | undefined> {
    const user: UserDocument = await this.usersService.findOne(userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    const payload: TokenPayload = {
      username: user.username,
      email: user.email,
      givenName: user.givenName,
      surname: user.surname,
      sub: user.id,
      roles: user.roles,
      isVerified: user.isVerified,
      isActivated: user.isActivated,
      isCompleted: user.isCompleted,
      loginProvider: loginProvider,
      profilePictureUrl: user.profilePictureUrl,
      permissions: user.permissions,
    };

    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(
      { sub: user.id },
      {
        secret: this.jwtConfig.refreshTokenSecret,
        expiresIn: this.jwtConfig.refreshTokenExpiration,
      },
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async register(registerDto: RegisterDto): Promise<TokenDto | undefined> {
    const userDto = this.usersMapper.mapper.map(
      registerDto,
      RegisterDto,
      CreateUserDto,
    );
    userDto.roles = [UserRoles.customer];
    userDto.isActivated = true;
    userDto.isVerified = true;
    userDto.isCompleted = false;

    const user: UserDocument = await this.usersService.create(userDto);
    return this.login(user.id, LoginProvider.local);
  }

  async verify(token: string): Promise<Boolean> {
    try {
      const { sub: userId } = await this.jwtService.verifyAsync(token);
      return this.usersService.verify(userId);
    } catch {
      throw new UnauthorizedException();
    }
  }

  async googleLogin(googleUser: GoogleUserDto): Promise<TokenDto> {
    let user: UserDocument = await this.usersService.findByUsername(
      googleUser.email,
    );

    if (!user) {
      user = await this.usersService.create({
        givenName: googleUser.firstName,
        surname: googleUser.lastName,
        email: googleUser.email,
        username: googleUser.email,
        profilePictureUrl: googleUser.picture,
        isActivated: true,
        isVerified: true,
        isCompleted: false,
        password: '',
        roles: [UserRoles.customer],
        permissions: [],
      });
    }

    return this.login(user.id, LoginProvider.google);
  }
}
