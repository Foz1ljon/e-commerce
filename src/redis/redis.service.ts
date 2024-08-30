import { Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);
  private readonly redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT, 10) || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      db: process.env.REDIS_DB ? parseInt(process.env.REDIS_DB, 10) : 0,
    });
  }

  async saveOtp(key: string, otp: string, expiresIn: number): Promise<void> {
    try {
      await this.redis.set(key, otp, 'EX', expiresIn); // Set OTP with expiration time (in seconds)
      this.logger.log(`OTP saved for key ${key}`);
    } catch (error) {
      this.logger.error(`Failed to save OTP: ${error.message}`, error.stack);
      throw new Error('Failed to save OTP');
    }
  }

  async getOtp(key: string): Promise<string | null> {
    try {
      const otp = await this.redis.get(key);
      if (otp) {
        this.logger.log(`OTP retrieved for key ${key}`);
      } else {
        this.logger.warn(`No OTP found for key ${key}`);
      }
      return otp;
    } catch (error) {
      this.logger.error(
        `Failed to retrieve OTP: ${error.message}`,
        error.stack,
      );
      throw new Error('Failed to retrieve OTP');
    }
  }

  async deleteOtp(key: string): Promise<void> {
    try {
      await this.redis.del(key);
      this.logger.log(`OTP deleted for key ${key}`);
    } catch (error) {
      this.logger.error(`Failed to delete OTP: ${error.message}`, error.stack);
      throw new Error('Failed to delete OTP');
    }
  }
}
