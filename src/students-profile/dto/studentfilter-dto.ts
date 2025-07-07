import { IsEnum, IsOptional, IsString } from 'class-validator';
import {
  schoolDepartment,
  schoolLevel,
  studentDepartment,
  studentLevel,
} from '../students-profile.entities';

export class StudentFilterQuery {
  @IsOptional()
  @IsString()
  matricNumber?: string;

  @IsOptional()
  @IsEnum(studentLevel)
  studentLevel?: schoolLevel;

  @IsOptional()
  @IsEnum(studentDepartment)
  department?: schoolDepartment;
}
