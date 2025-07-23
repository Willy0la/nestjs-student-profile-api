import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersDocument, UsersModelName } from './users.entities';
import { RedisService } from 'src/redis/redis.service';
import { LoginDto } from 'src/users/usersDto/login-dto';
import { UpdateUserDto } from 'src/users/usersDto/updateUserDto';
import * as bcrypt from 'bcrypt';
import { generateUserCacheKey } from 'src/cachekey/userKey';
import { RegisterUserDto } from '../users/usersDto/register-dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UsersModelName) private userModel: Model<UsersDocument>,
    private readonly redisService: RedisService,
  ) {}
  async register(registerUserDto: RegisterUserDto): Promise<{
    data: UsersDocument;
    message: string;
  }> {
    try {
      const passwordHash = await bcrypt.hash(registerUserDto.password, 10);
      const newUser = await this.userModel.create({
        ...registerUserDto,
        password: passwordHash,
      });

      // Optional: cache newly registered user
      const cacheKey = generateUserCacheKey(newUser._id.toString());
      await this.redisService.setKey(
        cacheKey,
        JSON.stringify(newUser.toObject()),
      );

      return {
        data: newUser,
        message: 'User successfully registered',
      };
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);

        if (error.message.includes('duplicate key')) {
          throw new BadRequestException('Email already in use');
        }

        throw new InternalServerErrorException('Unable to register new user');
      }

      throw new InternalServerErrorException('Unexpected error occurred');
    }
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ data: UsersDocument; message: string }> {
    try {
      const { email, password } = loginDto;

      if (!email && !password) {
        throw new BadRequestException('Kindly fill the required details');
      }
      const user = await this.userModel.findOne({ email });
      if (!user) {
        throw new NotFoundException('User with this email doesnt exist');
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (!isPasswordMatch) {
        throw new UnauthorizedException('Invalid password');
      }

      return {
        data: user,
        message: 'Login successful',
      };
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        throw new InternalServerErrorException('Unable to Login');
      }
      throw new InternalServerErrorException('Unexpected error occurred');
    }
  }

  async getAllUsers(): Promise<UsersDocument[]> {
    try {
      const users = await this.userModel.find();
      return users;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        throw new InternalServerErrorException('Unable to retrieve users');
      }
      throw new InternalServerErrorException('Unexpected error occurred');
    }
  }
  async getUserById(
    userId: string,
  ): Promise<{ message: string; data: UsersDocument; key: string }> {
    const cacheKey = generateUserCacheKey(userId);

    const cachedUser = await this.redisService.getKey<string>(cacheKey);

    if (cachedUser) {
      console.log(`Cache hit for user ID: ${userId}`);

      const parsedUser = JSON.parse(cachedUser) as UsersDocument;
      return {
        message: 'Student retrieved from cache',
        data: parsedUser,
        key: cacheKey,
      };
    }

    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const userPlainObject = user.toObject({ virtuals: true });
    await this.redisService.setKey(cacheKey, JSON.stringify(userPlainObject));

    return {
      message: 'User successfully retrieved',
      data: user,
      key: cacheKey,
    };
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<{ data: UsersDocument; message: string }> {
    try {
      const updatedUser = await this.userModel.findByIdAndUpdate(
        userId,
        updateUserDto,
        { new: true, runValidators: true },
      );

      if (!updatedUser) {
        throw new NotFoundException('User not found');
      }

      return {
        data: updatedUser,
        message: 'User successfully updated',
      };
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        throw new InternalServerErrorException('Unable to update user');
      }
      throw new InternalServerErrorException('Unexpected error occurred');
    }
  }
}
