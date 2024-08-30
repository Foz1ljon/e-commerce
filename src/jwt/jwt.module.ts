import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { JwtService } from './jwt.service';

@Module({
  imports: [
    NestJwtModule.register({
      secret: process.env.JWT_ACCESS_KEY || 'default-access-key', // Access key
      signOptions: { expiresIn: process.env.JWT_ACCESS_TIME || '1h' }, // Default to 1 hour if not specified
    }),
  ],
  providers: [JwtService],
  exports: [JwtService],
})
export class JwtModule {}
