import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';

@Injectable()
export class JwtService {
  constructor(private readonly jwtService: NestJwtService) {}

  // Generate both access and refresh tokens
  generateTokens(payload: any) {
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_ACCESS_TIME || '15h',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_KEY, // Use a different secret if provided
      expiresIn: process.env.JWT_REFRESH_TIME || '15d',
    });
    return {
      sub: payload.id,
      accessToken,
      refreshToken,
    };
  }

  // Verify access token
  verifyAccessToken(token: string): any {
    try {
      return this.jwtService.verify(token, {
        secret: process.env.JWT_ACCESS_KEY,
      });
    } catch (e) {
      // Handle the error as needed, e.g., logging or rethrowing
      return null;
    }
  }

  // Verify refresh token
  verifyRefreshToken(token: string): any {
    try {
      return this.jwtService.verify(token, {
        secret: process.env.JWT_REFRESH_KEY || process.env.JWT_ACCESS_KEY, // Use a different secret if provided
      });
    } catch (e) {
      // Handle the error as needed, e.g., logging or rethrowing
      return null;
    }
  }
}
