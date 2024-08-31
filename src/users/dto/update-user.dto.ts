import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
  Matches,
} from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({
    example: 'Ism',
    description: 'Foydalanuvchining ismi',
  })
  @IsOptional()
  @IsString({ message: "Ism faqat matnli bo'lishi kerak" })
  fname?: string;

  @ApiPropertyOptional({
    example: 'Familiya',
    description: 'Foydalanuvchining familiyasi',
  })
  @IsOptional()
  @IsString({ message: "Familiya faqat matnli bo'lishi kerak" })
  lname?: string;

  @ApiPropertyOptional({
    example: 'photo.jpg',
    description: 'Foydalanuvchining surati (ixtiyoriy)',
    required: false,
  })
  @IsOptional()
  @IsString({ message: "Surat faqat matnli bo'lishi kerak" })
  photo?: string;

  @ApiPropertyOptional({
    example: 'example@gmail.com',
    description: 'Foydalanuvchining elektron pochtasi (ixtiyoriy)',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: "Noto'g'ri elektron pochta manzili kiritilgan" })
  email?: string;

  @ApiPropertyOptional({
    example: '+998901234567',
    description: 'Foydalanuvchining telefon raqami (ixtiyoriy)',
    required: false,
  })
  @IsOptional()
  @IsPhoneNumber('UZ', { message: "Noto'g'ri telefon raqami kiritilgan" })
  phone_number?: string;

  @ApiPropertyOptional({
    example: 'strongPassword123',
    description: 'Foydalanuvchining paroli',
  })
  @IsOptional()
  @MinLength(6, { message: "Parol kamida 6 ta belgidan iborat bo'lishi kerak" })
  @Matches(/^[A-Za-z0-9]+$/, {
    message: "Parolda faqat harflar va raqamlar bo'lishi kerak",
  })
  password?: string;
}
