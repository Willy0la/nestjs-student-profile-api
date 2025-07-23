import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './usersDto/updateUserDto';
import { RegisterUserDto } from './usersDto/register-dto';
import { LoginDto } from './usersDto/login-dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get('')
  async getAllUsers() {
    return await this.usersService.getAllUsers();
  }
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return await this.usersService.getUserById(id);
  }
  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.updateUser(id, updateUserDto);
  }
  @Post('/register')
  async registerUser(@Body() registerUserDto: RegisterUserDto) {
    return await this.usersService.register(registerUserDto);
  }
  @Post('/login')
  async loginUser(@Body() loginDto: LoginDto) {
    return await this.usersService.login(loginDto);
  }
}
