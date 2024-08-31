import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Matches } from 'class-validator';

export class UpdateRoleDto {
  @ApiProperty({ example: 'admin', description: 'Rol nomi' })
  @IsOptional()
  @Matches(/^[A-Z]+$/, {
    message:
      "Rol nomi faqat katta harflarda bo'lishi kerak va bo'sh joy bo'lmasligi kerak",
  })
  name?: string;

  @ApiProperty({ example: 'Administrator rol', description: 'Rol tavsifi' })
  @IsOptional()
  @IsString({ message: "Rol tavsifi faqat matnli bo'lishi kerak" })
  description?: string;
}
