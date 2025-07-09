import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { studentDepartment, studentLevel } from '../students-profile.entities';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateDto {
  @ApiPropertyOptional({ example: 'MAT123456' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  matricNumber?: string;

  @ApiPropertyOptional({ example: 'John Doe' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  studentName?: string;

  @ApiPropertyOptional({ enum: studentLevel, example: studentLevel[0] })
  @IsOptional()
  @IsEnum(studentLevel)
  studentLevel?: (typeof studentLevel)[number]; // <-- Fix: use correct type for enum values

  @ApiPropertyOptional({
    enum: studentDepartment,
    example: studentDepartment[0],
  })
  @IsOptional()
  @IsEnum(studentDepartment)
  department?: (typeof studentDepartment)[number]; // <-- Fix: should be typeof studentDepartment[number]
}
