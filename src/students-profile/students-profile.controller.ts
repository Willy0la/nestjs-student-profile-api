import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { StudentsProfileService } from './students-profile.service';
import { CreateDTO } from './profile-dto/create-dto';
import { StudentFilterQuery } from './profile-dto/studentfilter-dto';
import { UpdateDto } from './profile-dto/update-dto';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('students')
@Controller('students')
export class StudentsProfileController {
  constructor(private readonly studentProfile: StudentsProfileService) {}
  @Get('')
  @HttpCode(200)
  async getStudents(
    @Query(new ValidationPipe({ transform: true })) filter: StudentFilterQuery,
  ) {
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

  @Put(':id')
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
