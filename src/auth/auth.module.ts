import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '@app/auth/auth.service';
import { AuthController } from '@app/auth/auth.controller';
import { UsersModule } from '@app/users/users.module';
import { JwtConfig } from '@app/app.config';
import { JwtStrategy } from '@app/auth/strategies/jwt.strategy';
import { LocalStrategy } from '@app/auth/strategies/local.strategy';
import { ProfilesModule } from '@app/profiles/profiles.module';
import { InvitationsModule } from '@app/invitations/invitations.module';
import { JwtRefreshStrategy } from '@app/auth/strategies/jwt-refresh.strategy';
import { GoogleStrategy } from '@app/auth/strategies/google.strategy';
import { AppleStrategy } from '@app/auth/strategies/apple.strategy';

@Module({
  imports: [
    InvitationsModule,
    UsersModule,
    ProfilesModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const jwtConfig = configService.get<JwtConfig>('jwt');
        return {
          secret: jwtConfig.secret,
          signOptions: {
            expiresIn: jwtConfig.expiration,
          },
        };
      },
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    GoogleStrategy,
    AppleStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
