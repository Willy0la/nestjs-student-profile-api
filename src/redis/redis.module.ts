import { Module, Global } from '@nestjs/common';
import { RedisService } from './redis.service';

@Global()
@Module({
  exports: [RedisService],
  providers: [RedisService],
})
export class RedisModule {}
// This module provides a Redis service that can be used globally in the application.
// The `@Global()` decorator makes the module available throughout the application without needing to import it in every module.
// The `RedisService` is exported so that it can be injected into other services or controllers.
// The service is responsible for managing the Redis client connection and can be configured using environment variables.
// The `RedisService` uses the `ioredis` library for Redis interactions, which is
