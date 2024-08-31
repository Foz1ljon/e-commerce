import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ example: 'ADMIN', description: 'Rol nomi' })
  @IsNotEmpty({ message: "Rol nomi bo'sh bo'lmasligi kerak" })
  @Matches(/^[A-Z]+$/, {
    message:
      "Rol nomi faqat katta harflarda bo'lishi kerak va bo'sh joy bo'lmasligi kerak",
  })
  name: string;

  @ApiProperty({ example: 'Administrator roli', description: 'Rol tavsifi' })
  @IsString({ message: "Rol tavsifi faqat matnli bo'lishi kerak" })
  description: string;
}
