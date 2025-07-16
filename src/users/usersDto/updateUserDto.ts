import { IsEmail, IsString, IsEnum, IsOptional } from 'class-validator';
import { role, UserRole } from '../users.entities';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEnum(role)
  role?: UserRole;
}
