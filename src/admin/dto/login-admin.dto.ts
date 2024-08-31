import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, MinLength } from 'class-validator';

export class LoginAdminDto {
  @IsPhoneNumber('UZ', { message: "Noto'g'ri telefon raqami kiritilgan" })
  phone_number: string;
  @ApiProperty({
    example: 'strongPassword123',
    description: 'Foydalanuvchining paroli',
  })
  @IsNotEmpty({ message: "Parol maydoni bo'sh bo'lmasligi kerak" })
  @MinLength(6, { message: "Parol kamida 6 ta belgidan iborat bo'lishi kerak" })
  password: string;
}
