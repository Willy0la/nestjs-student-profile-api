import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentsProfileModule } from './students-profile/students-profile.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './config/app.config';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisService } from './redis/redis.service';
import { UsersModule } from './users/users.module';
import { UsersController } from './users/users.controller';
import * as joi from 'joi';

@Module({
  imports: [
    StudentsProfileModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      envFilePath: [`.local.env`],
      validationSchema: joi.object({
        PORT: joi.number().default(3000),
        DB: joi.string().required(),
        REDIS_HOST: joi.string().default('localhost'),
        REDIS_PORT: joi.number().default(6379),
        NODE_ENV: joi
          .string()
          .valid('local', 'development', 'production')
          .default('local'),
      }),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        return { uri: config.get<string>('database.uri') };
      },
      inject: [ConfigService],
    }),
    UsersModule,
  ],
  controllers: [AppController, UsersController],
  providers: [AppService, RedisService],
})
export class AppModule {}
