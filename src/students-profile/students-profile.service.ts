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
import { Model } from 'mongoose';
import { UpdateDto } from './dto/update-dto';
import { CreateDTO } from './dto/create-dto';
import { RedisService } from 'src/redis/redis.service';
import { generateCacheKey } from 'src/cachekey/generateKey';

@Injectable()
export class StudentsProfileService {
  constructor(
    @InjectModel(StudentProfileModelName)
    private studentModel: Model<SchoolDocument>,
    private readonly redisService: RedisService,
  ) {}

  async getStudents(filter?: {
    studentLevel?: string;
    department?: string;
    matricNumber?: string;
  }): Promise<{ message: string; data: SchoolDocument[] }> {
    try {
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
      return { message: 'Students successfully retrieved', data: students };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Unable to get students', error);
      throw new InternalServerErrorException('Unable to get students');
    }
  }

  async getOneStudent(
    id: string,
  ): Promise<{ message: string; data: SchoolDocument; key: string }> {
    const cacheKey = generateCacheKey(id);

    const cached = await this.redisService.getKey<SchoolDocument>(cacheKey);
    if (cached) {
      console.log(`✅ Cache HIT for key: ${cacheKey}`);
      return {
        message: 'Student retrieved from cache',
        data: cached,
        key: cacheKey,
      };
    }

    const student = await this.studentModel.findById(id).exec();
    if (!student) {
      throw new NotFoundException('Student with ID not found');
    }
    await this.redisService.setKey(cacheKey, student);
    return {
      message: 'Student successfully retrieved',
      data: student,
      key: cacheKey,
    };
  }

  async createStudent(
    createDto: CreateDTO,
  ): Promise<{ message: string; data: SchoolDocument }> {
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
      return { message: 'Student successfully created', data: newStudent };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Unable to create new student', error);
      throw new InternalServerErrorException('Unable to create new student');
    }
  }
  async updateStudent(
    updateDto: UpdateDto,
    id: string,
  ): Promise<{ message: string; data: SchoolDocument }> {
    try {
      const updateStudent = await this.studentModel.findByIdAndUpdate(
        id,
        updateDto,
        { new: true, runValidators: true },
      );
      if (!updateStudent) {
        throw new NotFoundException('Student with ID not found');
      }
      return { message: 'Student successfully updated', data: updateStudent };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Unable to update student', error);
      throw new InternalServerErrorException('Unable to update student');
    }
  }

  async deleteStudent(
    id: string,
  ): Promise<{ message: string; data: SchoolDocument }> {
    try {
      const deleteStudent = await this.studentModel.findByIdAndDelete(id);

      if (!deleteStudent) {
        throw new NotFoundException('Student with ID not found');
      }

      await this.redisService.deleteKey(generateCacheKey(id));
      return {
        message: 'Student deleted successfully',
        data: deleteStudent,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Unable to delete student');
    }
  }
}
