import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import {
  schoolDepartment,
  schoolLevel,
  studentDepartment,
  studentLevel,
} from '../students-profile.entities';

export class CreateDTO {
  @IsString()
  @IsNotEmpty()
  matricNumber: string;

  @IsString()
  @IsNotEmpty()
  studentName: string;

  @IsNotEmpty()
  @IsEnum(studentLevel)
  studentLevel: schoolLevel;

  @IsNotEmpty()
  @IsEnum(studentDepartment)
  department: schoolDepartment;
}
