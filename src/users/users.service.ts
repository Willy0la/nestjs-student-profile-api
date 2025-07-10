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
import { RegisterUserDto } from './users-dto/Register-dto';
import { LoginDto } from 'src/students-profile/profile-dto/login-dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UsersModelName) private userModel: Model<UsersDocument>,
    private redis: RedisService,
  ) {}
  async register(registerUserDto: RegisterUserDto): Promise<{
    data: UsersDocument;
    message: string;
  }> {
    try {
      const newUser = await this.userModel.create(registerUserDto);

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
}
