import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ description: 'Foydalanuvchining mashhurligi' })
  @IsString()
  @IsNotEmpty()
  fname?: string;

  @ApiProperty({ description: 'Foydalanuvchining familiyasi' })
  @IsString()
  @IsNotEmpty()
  lname?: string;

  @ApiPropertyOptional({
    description: 'Foydalanuvchining telefon raqami (ixtiyoriy)',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: 'Foydalanuvchining elektron pochta manzili' })
  @IsEmail({}, { message: 'Elektron pochta manzili noto‘g‘ri formatda' })
  @IsNotEmpty()
  email?: string;

  @ApiProperty({ description: 'Foydalanuvchining paroli' })
  @IsString()
  @IsNotEmpty()
  password?: string;

  @ApiPropertyOptional({
    description: 'Foydalanuvchining fotosi (ixtiyoriy)',
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  photo?: any;

  @ApiProperty({ description: 'Foydalanuvchining yangilanish tokeni' })
  @IsString()
  @IsNotEmpty()
  refresh_token?: string;
}
