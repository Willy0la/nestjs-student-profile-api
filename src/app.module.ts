import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentsProfileModule } from './students-profile/students-profile.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './students-profile/app.config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    StudentsProfileModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      envFilePath: [`.env/.env.${process.env.NODE_ENV || 'development'}`],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        return { uri: config.get<string>('database.uri') };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
