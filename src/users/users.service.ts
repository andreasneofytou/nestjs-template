import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { hash } from 'bcrypt';
import { CreateUserDto } from '@app/users/dto/create-user.dto';
import { UpdateUserDto } from '@app/users/dto/update-user.dto';
import { User, UserDocument } from '@app/users/schema/user.schema';
import { compare } from 'bcrypt';
import * as crypto from 'crypto';
import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from 'unique-names-generator';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(
    createUserDto: CreateUserDto,
    session: mongoose.ClientSession = null,
  ): Promise<UserDocument> {
    const createdUser = new this.userModel(createUserDto);
    const hashedPassword = await hash(
      createUserDto.password ?? crypto.randomBytes(10).toString('hex'),
      10,
    );
    createdUser.password = hashedPassword;

    return createdUser.save({ session });
  }

  async createUsers(
    createUserDtos: CreateUserDto[],
    session: mongoose.ClientSession = null,
  ): Promise<UserDocument[]> {
    const users = createUserDtos.map(() => new this.userModel(createUserDtos));
    return await this.userModel.insertMany(users, { session });
  }

  async generateUsername() {
    let generatedName = '';
    let isUnique = false;
    let length = 2;
    let tries = 0;
    while (!isUnique) {
      if (tries++ > 10) {
        length++;
        tries = 0;
      }

      generatedName = uniqueNamesGenerator({
        dictionaries: [adjectives, colors, animals],
        length,
        separator: '-',
        style: 'capital',
      });

      isUnique = await this.isUsernameUnique(generatedName);
      this.logger.log(`Generated username: ${generatedName}`);
    }

    return generatedName;
  }

  private async isUsernameUnique(username: String): Promise<boolean> {
    return !!!(await this.userModel.exists({
      username,
    }));
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find();
  }

  async findOne(id: string): Promise<UserDocument> {
    this.validateId(id);
    return this.userModel.findOne({ _id: id });
  }

  async findByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email });
  }

  async findByUsername(username: string): Promise<UserDocument> {
    return this.userModel.findOne({ username });
  }

  async isEmailTaken(email: string) {
    const result = await this.userModel.exists({ email });
    return !!result;
  }

  async isPhoneNumberTaken(phoneNumber: string) {
    const result = await this.userModel.exists({ phoneNumber });
    return !!result;
  }

  async isUsernameTaken(username: string) {
    const result = await this.userModel.exists({ username });
    return !!result;
  }

  async completeUser(id: string, session?: mongoose.ClientSession) {
    this.validateId(id);
    const updateResult = await this.userModel.updateOne(
      { _id: id },
      { isActivated: true, isVerified: true, isCompleted: true },
      { session },
    );

    return updateResult.matchedCount === 1;
  }

  private validateId(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID');
    }
  }

  async verify(id: string) {
    this.validateId(id);
    const result = await this.userModel.updateOne(
      { _id: id },
      { isVerified: true, isActivated: true },
    );
    return result.matchedCount > 0 && result.modifiedCount > 0;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    this.validateId(id);
    const user = await this.userModel.findOne({ _id: id });

    if (!user) {
      throw new NotFoundException();
    }

    if (updateUserDto.password) {
      const isPasswordMatch = await compare(
        updateUserDto.currentPassword ?? '',
        user.password,
      );
      if (isPasswordMatch || user.resetPassword) {
        updateUserDto.password = await hash(updateUserDto.password, 10);
        updateUserDto.resetPassword = false;
      } else {
        throw new UnauthorizedException('Wrong password');
      }
    }

    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
  }

  async updateWhere(where: any, updateUserDto: UpdateUserDto) {
    return this.userModel.updateOne(where, updateUserDto);
  }
}
