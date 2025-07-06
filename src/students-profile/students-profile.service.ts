import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  SchoolDocument,
  StudentProfileModelName,
} from './students-profile.entities';
import mongoose, { Model } from 'mongoose';
import { UpdateDto } from './dto/update-dto';
import { CreateDTO } from './dto/create-dto';

@Injectable()
export class StudentsProfileService {
  constructor(
    @InjectModel(StudentProfileModelName)
    private studentModel: Model<SchoolDocument>,
  ) {}

  async getStudents(filter?: {
    studentLevel?: string;
    department?: string;
    matricNumber?: string;
  }) {
    const query: Record<string, any> = {};

    if (filter?.department) {
      query.department = filter.department;
    }
    if (filter?.studentLevel) {
      query.studentLevel = filter.studentLevel;
    }

    if (filter?.matricNumber) {
      query.matricNumber = { $regex: filter.matricNumber, $options: 'i' };
    }
    const students = await this.studentModel.find(query).exec();
    return students;
  }

  async getOneStudent(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Bad ID format');
    }
    const student = await this.studentModel.findById(id).exec();
    if (!student) {
      throw new NotFoundException('Student with ID not found');
    }
    return student;
  }

  async createStudent(createDto: CreateDTO) {
    try {
      const student = await this.studentModel
        .findOne({
          matricNumber: createDto.matricNumber,
        })
        .exec();
      if (student) {
        throw new BadRequestException(
          'Student with this Matric number already exists',
        );
      }
      const newStudent = await this.studentModel.create(createDto);
      return newStudent;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Unable to create new student', error);
      throw new InternalServerErrorException('Unable to create new student');
    }
  }
  async updateStudent(updateDto: UpdateDto, id: string) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Bad ID format');
      }
      const student = await this.studentModel.findById(id).exec();
      if (!student) {
        throw new NotFoundException('Student with ID not found');
      }
      const updateStudent = await this.studentModel.findByIdAndUpdate(
        id,
        updateDto,
        { new: true, runValidators: true },
      );
      return updateStudent;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Unable to update student', error);
      throw new InternalServerErrorException('Unable to update student');
    }
  }
}
