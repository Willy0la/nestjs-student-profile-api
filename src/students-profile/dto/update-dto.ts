import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import {
  schoolDepartment,
  schoolLevel,
  studentDepartment,
  studentLevel,
} from '../students-profile.entities';

export class UpdateDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  matricNumber?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  studentName?: string;

  @IsOptional()
  @IsEnum(studentLevel)
  studentLevel?: schoolLevel;

  @IsOptional()
  @IsEnum(studentDepartment)
  department?: schoolDepartment;
}
