import { IsEmail, IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { role, UserRole } from '../users.entities';

export class RegisterUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEnum(role)
  @IsNotEmpty()
  role: UserRole;
}
