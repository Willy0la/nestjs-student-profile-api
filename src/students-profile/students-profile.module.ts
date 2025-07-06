import { Module } from '@nestjs/common';
import { StudentsProfileController } from './students-profile.controller';
import { StudentsProfileService } from './students-profile.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SchoolSchema,
  StudentProfileModelName,
} from './students-profile.entities';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StudentProfileModelName, schema: SchoolSchema },
    ]),
  ],
  controllers: [StudentsProfileController],
  providers: [StudentsProfileService],
})
export class StudentsProfileModule {}
