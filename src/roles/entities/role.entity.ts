import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('roles') // Rolni saqlaydigan ma'lumotlar bazasi jadvallarini belgilaydi
export class Role {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    example: 1,
    description: 'Rolning unikal ID raqami',
  })
  id: number;

  @Column()
  @ApiProperty({
    example: 'admin',
    description: 'Rol nomi (masalan, admin yoki user)',
  })
  name: string;

  @Column({ nullable: true })
  @ApiProperty({
    example: 'Administrator rol',
    description: 'Rol tavsifi (ixtiyoriy)',
    required: false,
  })
  description: string;

  @OneToMany(() => User, (user) => user.role)
  @ApiProperty({
    type: () => User,
    isArray: true,
    description: 'Bu rolga tegishli foydalanuvchilar',
  })
  users: User[];
}
