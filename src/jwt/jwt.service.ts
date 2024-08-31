import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';

@Injectable()
export class JwtService {
  constructor(private readonly jwtService: NestJwtService) {}

  /**
   * Ham access (kirish) ham refresh (yangilash) tokenlarini yaratadi.
   *
   * @param payload - Token ichida bo'lishi kerak bo'lgan ma'lumotlar, odatda foydalanuvchi tafsilotlari (id, rol, va hokazo) bo'ladi.
   * @returns Quyidagi ma'lumotlarni o'z ichiga olgan obyekt:
   *  - `sub`: Subyekt identifikatori (odatda foydalanuvchi id'si)
   *  - `accessToken`: Yaratilgan access token
   *  - `refreshToken`: Yaratilgan refresh token
   *
   * Access tokenning muddati `JWT_ACCESS_TIME` ga (standart: 15 soat) ko'ra tugaydi.
   * Refresh tokenning muddati `JWT_REFRESH_TIME` ga (standart: 15 kun) ko'ra tugaydi.
   */
  generateTokens(payload: any) {
    const pay = {
      sub: payload.id,
      role: payload.role,
      active: payload.active,
    };

    const accessToken = this.jwtService.sign(pay, {
      expiresIn: process.env.JWT_ACCESS_TIME || '24h',
    });
    const refreshToken = this.jwtService.sign(pay, {
      secret: process.env.JWT_REFRESH_KEY,
      expiresIn: process.env.JWT_REFRESH_TIME || '18d',
    });
    return {
      sub: payload.id,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Aktivatsiya tokenini generatsiya qiladi.
   *
   * @param payload - Token ichida bo'lishi kerak bo'lgan ma'lumotlar.
   * @returns Yaratilgan aktivatsiya tokeni.
   */
  generateActivationToken(payload: any) {
    return this.jwtService.sign(
      { sub: payload.id },
      {
        expiresIn: process.env.JWT_ACTIVATION_TIME || '3m', // Aktivatsiya tokeni muddati
      },
    );
  }

  /**
   * Access tokenning haqiqiyligini tekshiradi.
   *
   * @param token - Tekshirilishi kerak bo'lgan JWT access token.
   * @returns Agar token haqiqiy bo'lsa, dekodlangan payload yoki agar token haqiqiy emas yoki muddati o'tgan bo'lsa `null` qaytaradi.
   *
   * Bu usul `JWT_ACCESS_KEY` yordamida verifikatsiya qilinadi.
   */
  verifyAccessToken(token: string): any {
    try {
      return this.jwtService.verify(token, {
        secret: process.env.JWT_ACCESS_KEY,
      });
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  /**
   * Refresh tokenning haqiqiyligini tekshiradi.
   *
   * @param token - Tekshirilishi kerak bo'lgan JWT refresh token.
   * @returns Agar token haqiqiy bo'lsa, dekodlangan payload yoki agar token haqiqiy emas yoki muddati o'tgan bo'lsa `null` qaytaradi.
   *
   * Bu usul `JWT_REFRESH_KEY` yordamida verifikatsiya qilinadi, yoki agar bu kalit mavjud bo'lmasa, `JWT_ACCESS_KEY` dan foydalaniladi.
   */
  verifyRefreshToken(token: string): any {
    try {
      return this.jwtService.verify(token, {
        secret: process.env.JWT_REFRESH_KEY,
      });
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  /**
   * Aktivatsiya tokenning haqiqiyligini tekshiradi.
   *
   * @param token - Tekshirilishi kerak bo'lgan JWT aktivatsiya token.
   * @returns Agar token haqiqiy bo'lsa, dekodlangan payload yoki agar token haqiqiy emas yoki muddati o'tgan bo'lsa `null` qaytaradi.
   */
  verifyActivationToken(token: string): any {
    try {
      return this.jwtService.verify(token, {
        secret: process.env.JWT_ACTIVATION_KEY, // Aktivatsiya tokeni uchun maxfiy kalit
      });
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
