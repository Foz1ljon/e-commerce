import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../roles/entities/role.entity';

@Entity('users') // Foydalanuvchilarni saqlaydigan ma'lumotlar bazasi jadvallarini belgilaydi
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    example: 1,
    description: 'Foydalanuvchining unikal ID raqami',
  })
  id: number;

  @Column({ nullable: true })
  @ApiProperty({ example: 'Ism', description: 'Foydalanuvchining ismi' })
  fname: string;

  @Column({ nullable: true })
  @ApiProperty({
    example: 'Familiya',
    description: 'Foydalanuvchining familiyasi',
  })
  lname: string;

  @Column({ nullable: true })
  @ApiProperty({
    example: 'photo.jpg',
    description: 'Foydalanuvchining surati (ixtiyoriy)',
    required: false,
  })
  photo: string;

  @Column({ unique: true, nullable: true })
  @ApiProperty({
    example: 'example@gmail.com',
    description: 'Foydalanuvchining elektron pochtasi (ixtiyoriy)',
    required: false,
  })
  email: string;

  @Column({ nullable: true })
  @ApiProperty({
    example: '+998901234567',
    description: 'Foydalanuvchining telefon raqami (ixtiyoriy)',
    required: false,
  })
  phone_number: string;

  @Column()
  @ApiProperty({
    example: 'strongPassword123',
    description: 'Foydalanuvchining paroli',
  })
  password: string;

  @Column({ default: false }) // default qiymati true bo'lishi
  @ApiProperty({
    example: true,
    description: 'Foydalanuvchining faolligi',
  })
  active: boolean;

  @Column({ default: false }) // default qiymati false
  @ApiProperty({
    example: false,
    description: "Foydalanuvchining egasi (admin bo'lishi) statusi",
  })
  owner: boolean; // Owner bo'lishi, ya'ni admin bo'lishi

  @ManyToOne(() => Role, (role) => role.users)
  @ApiProperty({
    type: () => Role,
    description: 'Foydalanuvchining roli',
  })
  role: Role;

  @Column({ nullable: true })
  @ApiProperty({
    description: 'Foydalanuvchining shifrlangan refresh tokeni',
  })
  refreshtoken: string;

  @CreateDateColumn()
  @ApiProperty({
    example: '2024-08-31T12:00:00.000Z',
    description: 'Foydalanuvchi yaratilgan sana',
  })
  createdAt: Date;
}
