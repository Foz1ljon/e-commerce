import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private rolesRepository: Repository<Role>,
  ) {}

  // Rol nomi bo'yicha rolni topish uchun yordamchi metod
  private async findRoleByName(name: string): Promise<Role | null> {
    return this.rolesRepository.findOne({ where: { name } });
  }

  // Yangi rol yaratish
  async create(createRoleDto: CreateRoleDto) {
    // Agar rol allaqachon mavjud bo'lsa, xato qaytaradi
    const findRole = await this.findRoleByName(createRoleDto.name);
    if (findRole) throw new ConflictException('Bu rol allaqachon mavjud!');

    // Yangi rol yaratish va saqlash
    const role = this.rolesRepository.create(createRoleDto);
    await this.rolesRepository.save(role);

    // Yaratilgan rolni tasdiqlash uchun qaytarish
    return { message: 'Rol yaratildi!', role };
  }

  // Barcha rollarni topish
  async findAll(): Promise<Role[]> {
    return this.rolesRepository.find();
  }

  // ID bo'yicha rolni topish
  async findOne(id: number): Promise<Role> {
    const role = await this.rolesRepository.findOneBy({ id });
    if (!role) throw new NotFoundException('Rol topilmadi'); // Agar rol topilmasa, xato qaytaradi
    return role;
  }

  // Rolni yangilash
  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    // Rolni ID bo'yicha topish
    const role = await this.findOne(id);

    // Agar yangilanishi kerak bo'lsa, rol nomini yangilash
    if (updateRoleDto.name) {
      const findRole = await this.findRoleByName(updateRoleDto.name);
      // Agar rol nomi allaqachon mavjud bo'lsa, xato qaytaradi
      if (findRole && findRole.id !== id) {
        throw new ConflictException('Bu rol nomi allaqachon mavjud');
      }
      role.name = updateRoleDto.name; // Rol nomini yangilash
    }

    // Agar yangilanishi kerak bo'lsa, rol tavsifini yangilash
    if (updateRoleDto.description) {
      role.description = updateRoleDto.description; // Tavsifni yangilash
    }

    // Yangilangan rolni saqlash
    await this.rolesRepository.save(role);
    return role; // Yangilangan rolni qaytarish
  }

  // Rolni o'chirish
  async remove(id: number): Promise<Role> {
    const role = await this.findOne(id); // Rolni topish
    await this.rolesRepository.delete(id); // Rolni o'chirish
    return role; // O'chirilgan rolni qaytarish
  }
}
