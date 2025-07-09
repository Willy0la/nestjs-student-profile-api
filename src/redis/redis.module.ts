import { Module, Global } from '@nestjs/common';
import { RedisService } from './redis.service';

@Global()
@Module({
  exports: [RedisService],
  providers: [RedisService],
})
export class RedisModule {}
// This module provides a Redis service that can be used globally in the application.
