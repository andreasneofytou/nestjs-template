import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from '@app/users/users.service';
import { UsersController } from '@app/users/users.controller';
import { User, UserSchema } from '@app/users/schema/user.schema';
import { UsersMapper } from '@app/users/users.mapper';
import { AuthModule } from '@app/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersMapper],
  exports: [UsersService, UsersMapper],
})
export class UsersModule {}
