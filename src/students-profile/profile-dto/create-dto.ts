import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { studentDepartment, studentLevel } from '../students-profile.entities';
export class CreateDTO {
  @ApiProperty({ example: 'MAT123456' })
  @IsString()
  @IsNotEmpty()
  matricNumber: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  studentName: string;

  @ApiProperty({ example: '100', enum: studentLevel })
  @IsNotEmpty()
  @IsEnum(studentLevel)
  studentLevel: keyof typeof studentLevel;

  @ApiProperty({ example: 'SCIENCE', enum: studentDepartment })
  @IsNotEmpty()
  @IsEnum(studentDepartment)
  department: keyof typeof studentDepartment;
}
