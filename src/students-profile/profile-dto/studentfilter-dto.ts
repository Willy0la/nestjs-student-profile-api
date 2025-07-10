import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { studentDepartment, studentLevel } from '../students-profile.entities';

type StudentLevel = (typeof studentLevel)[number];
type StudentDepartment = (typeof studentDepartment)[number];

export class StudentFilterQuery {
  @ApiPropertyOptional({ description: 'Matriculation number of the student' })
  @IsOptional()
  @IsString()
  matricNumber?: string;

  @ApiPropertyOptional({
    enum: studentLevel,
    description: 'Level of the student',
  })
  @IsOptional()
  @IsEnum(studentLevel)
  level?: StudentLevel;

  @ApiPropertyOptional({
    enum: studentDepartment,
    description: 'Department of the student',
  })
  @IsOptional()
  @IsEnum(studentDepartment)
  department?: StudentDepartment;
}
