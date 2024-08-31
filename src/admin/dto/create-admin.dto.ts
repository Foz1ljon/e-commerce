import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsPhoneNumber,
  MinLength,
  IsInt,
} from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({
    example: 'Ism',
    description: 'Adminning ismi',
  })
  @IsNotEmpty({ message: "Ism maydoni bo'sh bo'lmasligi kerak" })
  @IsString({ message: "Ism faqat matnli bo'lishi kerak" })
  fname: string;

  @ApiProperty({
    example: 'Familiya',
    description: 'Adminning familiyasi',
  })
  @IsNotEmpty({ message: "Familiya maydoni bo'sh bo'lmasligi kerak" })
  @IsString({ message: "Familiya faqat matnli bo'lishi kerak" })
  lname: string;

  @ApiProperty({
    example: '+998901234567',
    description: 'Adminning telefon raqami',
  })
  @IsNotEmpty({ message: "Telefon raqami maydoni bo'sh bo'lmasligi kerak" })
  @IsPhoneNumber('UZ', { message: "Noto'g'ri telefon raqami kiritilgan" })
  phone_number: string;

  @ApiProperty({
    example: 'strongPassword123',
    description: 'Adminning paroli',
  })
  @IsNotEmpty({ message: "Parol maydoni bo'sh bo'lmasligi kerak" })
  @MinLength(6, { message: "Parol kamida 6 ta belgidan iborat bo'lishi kerak" })
  password: string;

  @ApiProperty({
    example: 1,
    description: 'Adminning rol ID raqami',
  })
  @IsNotEmpty({ message: "Rol ID maydoni bo'sh bo'lmasligi kerak" })
  @IsInt({ message: "Rol ID faqat butun son bo'lishi kerak" })
  roleId: number; // Rol ID maydoni
}
