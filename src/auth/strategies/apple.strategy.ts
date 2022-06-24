import { AppleConfig } from '@app/app.config';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-apple';
import { join } from 'path';

@Injectable()
export class AppleStrategy extends PassportStrategy(Strategy, 'apple') {
  private readonly logger = new Logger(AppleStrategy.name);
  constructor(configService: ConfigService) {
    const appleConfig = configService.get<AppleConfig>('apple');
    super({
      clientID: appleConfig.clientID,
      teamID: appleConfig.teamID,
      callbackURL: appleConfig.callbackURL,
      keyID: appleConfig.keyID,
      privateKeyLocation: join(__dirname, appleConfig.privateKeyLocation),
      passReqToCallback: appleConfig.passReqToCallback,
    });
  }

  async validate(
    request: any,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    const user = {
      accessToken,
      refreshToken,
    };
    done(null, profile);
  }
}
