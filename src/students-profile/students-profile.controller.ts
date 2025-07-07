import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { StudentsProfileService } from './students-profile.service';
import { CreateDTO } from './dto/create-dto';
import { StudentFilterQuery } from './dto/studentfilter-dto';
import { UpdateDto } from './dto/update-dto';
import { ParseObjectIdPipe } from '@nestjs/mongoose';

@Controller('students-profile')
export class StudentsProfileController {
  constructor(private readonly studentProfile: StudentsProfileService) {}
  @Get('')
  @HttpCode(200)
  async getStudents(@Query() filter: StudentFilterQuery) {
    return await this.studentProfile.getStudents(filter);
  }
  @Get(':id')
  @HttpCode(200)
  async getOneStudent(@Param('id', new ParseObjectIdPipe()) id: string) {
    return await this.studentProfile.getOneStudent(id);
  }

  @Post('/')
  @HttpCode(201)
  async createStudent(@Body() createDto: CreateDTO) {
    return await this.studentProfile.createStudent(createDto);
  }

  @Patch(':id')
  @HttpCode(200)
  async updateStudent(
    @Param('id', new ParseObjectIdPipe()) id: string,
    @Body() updateDto: UpdateDto,
  ) {
    return await this.studentProfile.updateStudent(updateDto, id);
  }

  @Delete(':id')
  async deleteStudent(@Param('id', new ParseObjectIdPipe()) id: string) {
    return await this.studentProfile.deleteStudent(id);
  }
}
