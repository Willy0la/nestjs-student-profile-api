import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export const studentLevel = [
  '100 level',
  '200 level',
  '300 level',
  '400 level',
] as const;

export const studentDepartment = [
  'Art',
  'Science',
  'Commercial',
  'Engineering',
] as const;

export type schoolDepartment = (typeof studentDepartment)[number];
export type schoolLevel = (typeof studentLevel)[number];

@Schema({ timestamps: true })
export class StudentProfileSchema {
  @Prop({
    unique: true,
    required: true,
    type: String,
  })
  matricNumber: string;

  @Prop({
    required: true,
    type: String,
  })
  studentName: string;
  @Prop({
    enum: studentLevel,
    required: true,
    type: String,
  })
  studentLevel: schoolLevel;
  @Prop({
    enum: studentDepartment,
    required: true,
    type: String,
  })
  department: schoolDepartment;
}

export type SchoolDocument = StudentProfileSchema & Document;
export const SchoolSchema = SchemaFactory.createForClass(StudentProfileSchema);
export const StudentProfileModelName = 'StudentProfile';
