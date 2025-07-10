import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

import { MongooseModule } from '@nestjs/mongoose';
import { UsersSchema } from './users.entities';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UsersSchema }])],

  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
