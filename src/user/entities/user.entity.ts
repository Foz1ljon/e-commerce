import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Foydalanuvchining yagona identifikatori' })
  id: number;

  @Column({ nullable: true })
  @ApiPropertyOptional({ description: 'Foydalanuvchining fotosi (ixtiyoriy)' })
  photo?: string;

  @Column()
  @ApiProperty({ description: 'Foydalanuvchining mashhurligi' })
  fame: string;

  @Column()
  @ApiProperty({ description: 'Foydalanuvchining familiyasi' })
  lname: string;

  @Column({ nullable: true })
  @ApiPropertyOptional({
    description: 'Foydalanuvchining telefon raqami (ixtiyoriy)',
  })
  phone?: string;

  @Column()
  @ApiProperty({ description: 'Foydalanuvchining elektron pochta manzili' })
  email: string;

  @Column()
  @ApiProperty({ description: 'Foydalanuvchining paroli' })
  password: string;

  @Column({ default: false })
  @ApiProperty({ description: 'Foydalanuvchi statusi: faol | nofaol' })
  active: boolean;

  @Column()
  @ApiProperty({ description: 'Foydalanuvchining yangilanish tokeni' })
  refresh_token: string;
}
