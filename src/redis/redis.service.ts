import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly client: Redis;
  constructor(private readonly configService: ConfigService) {
    this.client = new Redis({
      port: configService.get<number>('REDIS_PORT', 6379),
      host: configService.get<string>('REDIS_HOST', 'localhost'),
    });
  }
  async setKey<T = any>(key: string, value: T, ttl = 3600): Promise<void> {
    try {
      await this.client.set(key, JSON.stringify(value), 'EX', ttl);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to set key ${key} in Redis: ${error.message}`);
      }

      // Handle specific error types if needed
      // For example, if you want to log or handle connection errors differently
    }
  }

  async getKey<T = any>(key: string): Promise<T | null> {
    try {
      const data = await this.client.get(key);

      const keyGotten = data ? (JSON.parse(data) as T) : null;
      return keyGotten;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Failed to get key ${key} from Redis: ${error.message}`,
        );
      }
      return null;
    }
  }

  async hasKey(key: string): Promise<boolean> {
    try {
      const data = await this.client.exists(key);
      return data === 1;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Existing key ${key} from Redis ${error.message}`);
      }
      throw error;
    }
  }

  async deleteKey(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Unable to delete key ${key} from Redis: ${error.message}`,
        );
      }
      throw error;
    }
  }
  async quit(): Promise<void> {
    try {
      await this.client.quit();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Unable to Quit from Redis: ${error.message}`);
      }
    }
  }
  async flushAll(): Promise<void> {
    try {
      await this.client.flushall();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Unable to Flush all keys  from Redis: ${error.message}`,
        );
      }
    }
  }
}

// This service provides a Redis client that can be used throughout the application.
// It uses the ioredis library for Redis interactions and is configured using environment variables.
