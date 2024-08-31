import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsPhoneNumber,
  MinLength,
  IsInt,
} from 'class-validator';

export class UpdateAdminDto {
  @ApiProperty({
    example: 'Ism',
    description: 'Adminning ismini yangilash (ixtiyoriy)',
    required: false,
  })
  @IsOptional()
  @IsString({ message: "Ism faqat matnli bo'lishi kerak" })
  fname?: string;

  @ApiProperty({
    example: 'Familiya',
    description: 'Adminning familiyasini yangilash (ixtiyoriy)',
    required: false,
  })
  @IsOptional()
  @IsString({ message: "Familiya faqat matnli bo'lishi kerak" })
  lname?: string;

  @ApiProperty({
    example: '+998901234567',
    description: 'Adminning telefon raqamini yangilash (ixtiyoriy)',
    required: false,
  })
  @IsOptional()
  @IsPhoneNumber('UZ', { message: "Noto'g'ri telefon raqami kiritilgan" })
  phone_number?: string;

  @ApiProperty({
    example: 'strongPassword123',
    description: 'Adminning parolini yangilash (ixtiyoriy)',
    required: false,
  })
  @IsOptional()
  @MinLength(6, { message: "Parol kamida 6 ta belgidan iborat bo'lishi kerak" })
  password?: string;

  @ApiProperty({
    example: 1,
    description: 'Adminning rol ID raqami (ixtiyoriy)',
    required: false,
  })
  @IsOptional()
  @IsInt({ message: "Rol ID faqat butun son bo'lishi kerak" })
  roleId?: number; // Rol ID maydoni
}
