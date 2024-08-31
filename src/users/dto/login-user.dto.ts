import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Foydalanuvchining elektron pochta manzili',
    required: true,
  })
  @IsEmail({}, { message: "Noto'g'ri elektron pochta manzili kiritilgan" })
  email: string;

  @ApiProperty({
    example: 'StrongP@ssword123',
    description: 'Foydalanuvchining paroli',
    required: true,
  })
  @IsNotEmpty({ message: "Parol maydoni bo'sh bo'lmasligi kerak" })
  @IsString({ message: "Parol faqat matnli bo'lishi kerak" })
  password: string;
}
