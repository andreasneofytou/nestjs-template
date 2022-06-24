import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { JwtConfig } from '@app/app.config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from '@app/auth/dto/token-payload';
import { LocalUser } from '@app/auth/dto/local-user';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const { secret } = configService.get<JwtConfig>('jwt');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  validate(payload: TokenPayload): LocalUser {
    if (!payload.isVerified) {
      throw new ForbiddenException('User not verified');
    }
    return {
      id: payload.sub,
      email: payload.email,
      roles: payload.roles,
      givenName: payload.givenName,
      surname: payload.surname,
      isActivated: payload.isActivated,
      isCompleted: payload.isCompleted,
      isVerified: payload.isVerified,
    };
  }
}
