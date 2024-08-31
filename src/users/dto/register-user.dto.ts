import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Ism', description: 'Foydalanuvchining ismi' })
  @IsNotEmpty({ message: "Ism maydoni bo'sh bo'lmasligi kerak" })
  @IsString({ message: "Ism faqat matnli bo'lishi kerak" })
  fname: string;

  @ApiProperty({
    example: 'Familiya',
    description: 'Foydalanuvchining familiyasi',
  })
  @IsNotEmpty({ message: "Familiya maydoni bo'sh bo'lmasligi kerak" })
  @IsString({ message: "Familiya faqat matnli bo'lishi kerak" })
  lname: string;

  @ApiProperty({
    example: 'photo.jpg',
    description: 'Foydalanuvchining surati (ixtiyoriy)',
    required: false,
  })
  @IsOptional()
  @IsString({ message: "Surat faqat matnli bo'lishi kerak" })
  photo: string;

  @ApiProperty({
    example: 'example@gmail.com',
    description: 'Foydalanuvchining elektron pochtasi (ixtiyoriy)',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: "Noto'g'ri elektron pochta manzili kiritilgan" })
  email: string;

  @ApiProperty({
    example: '+998901234567',
    description: 'Foydalanuvchining telefon raqami (ixtiyoriy)',
    required: false,
  })
  @IsOptional()
  @IsPhoneNumber('UZ', { message: "Noto'g'ri telefon raqami kiritilgan" })
  phone_number: string;

  @ApiProperty({
    example: 'strongPassword123',
    description: 'Foydalanuvchining paroli',
  })
  @IsNotEmpty({ message: "Parol maydoni bo'sh bo'lmasligi kerak" })
  @MinLength(6, { message: "Parol kamida 6 ta belgidan iborat bo'lishi kerak" })
  @Matches(/^[A-Za-z0-9]+$/, {
    message: "Parolda faqat harflar va raqamlar bo'lishi kerak",
  })
  password: string;
}
