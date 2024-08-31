import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { LoginAdminDto } from './dto/login-admin.dto';
import { Role } from '../roles/entities/role.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, // Foydalanuvchilar ma'lumotlari bilan ishlash uchun repository
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>, // Rollar bilan ishlash uchun repository
  ) {}

  // Admin yaratish
  async create(createAdminDto: CreateAdminDto) {
    const existingAdmin = await this.userRepository.findOneBy({
      phone_number: createAdminDto.phone_number, // Telefon raqamiga qarab qidiramiz
    });

    if (existingAdmin) {
      throw new ConflictException('Bu admin allaqachon mavjud!');
    }

    const role = await this.roleRepository.findOneBy({
      id: createAdminDto.roleId,
    }); // Rolni topish

    if (!role) {
      throw new NotFoundException(`Rol #${createAdminDto.roleId} topilmadi`); // Agar rol topilmasa, xato qaytarish
    }

    // Parolni hash qilish
    const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);

    const newAdmin = this.userRepository.create({
      ...createAdminDto,
      password: hashedPassword, // Hashed parolni qo'shish
      role, // Admin rolini qo'shish
    });

    await this.userRepository.save(newAdmin);
    return newAdmin; // Yangi adminni qaytarish
  }

  // Admin login qilish
  async login(login: LoginAdminDto) {
    // Telefon raqami orqali adminni topish
    const admin = await this.userRepository.findOne({
      where: {
        phone_number: login.phone_number,
        active: true, // Adminning faolligini tekshirish
      },
    });
    if (admin.role.name == 'USER')
      throw new ForbiddenException("Sizga ruxsat yo'q!");
    // Admin topilmasa, xato qaytarish
    if (!admin) {
      throw new UnauthorizedException('Telefon raqami yoki parol noto‘g‘ri');
    }

    // Parolni tekshirish
    const isPasswordMatching = await bcrypt.compare(
      login.password,
      admin.password,
    );
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Telefon raqami yoki parol noto‘g‘ri');
    }

    // Kirish muvaffaqiyatli bo'lsa, adminni qaytarish
    return admin;
  }

  // Barcha adminlarni ko'rsatish
  async findAll() {
    return await this.userRepository.find({
      where: { role: { name: 'admin' } },
    });
  }

  // Bitta adminni topish
  async findOne(id: number) {
    const admin = await this.userRepository.findOne({
      where: { id, role: { name: 'admin' } },
    });
    if (!admin) throw new NotFoundException(`Admin #${id} topilmadi`);
    return admin;
  }

  // Adminni yangilash
  async update(id: number, updateAdminDto: UpdateAdminDto) {
    const admin = await this.findOne(id); // Adminni topish

    // Adminning boshqa maydonlarini yangilash
    if (updateAdminDto.fname) {
      admin.fname = updateAdminDto.fname; // Ismni yangilash
    }

    if (updateAdminDto.lname) {
      admin.lname = updateAdminDto.lname; // Familiyasini yangilash
    }

    if (updateAdminDto.phone_number) {
      const existingAdmin = await this.userRepository.findOneBy({
        phone_number: updateAdminDto.phone_number,
      });

      if (existingAdmin && existingAdmin.id !== admin.id) {
        throw new ConflictException('Bu telefon raqami allaqachon mavjud!'); // Yana bir admin topilsa
      }

      admin.phone_number = updateAdminDto.phone_number; // Telefon raqamini yangilash
    }

    if (updateAdminDto.roleId) {
      const role = await this.roleRepository.findOneBy({
        id: updateAdminDto.roleId,
      }); // Yangilanayotgan rolni topish
      if (!role) {
        throw new NotFoundException(`Rol #${updateAdminDto.roleId} topilmadi`); // Agar rol topilmasa, xato qaytarish
      }
      admin.role = role; // Admin rolini yangilash
    }

    if (updateAdminDto.password) {
      // Agar parol yangilanayotgan bo'lsa, uni hash qilish
      admin.password = await bcrypt.hash(updateAdminDto.password, 10);
    }

    await this.userRepository.save(admin); // Yangilangan adminni saqlash

    return admin; // Yangilangan adminni qaytarish
  }

  // Adminni o'chirish (faqat active ni false ga o'zgartirish)
  async remove(id: number) {
    const admin = await this.findOne(id); // Adminni topish
    admin.active = false; // Adminning aktivligini o'chirish
    await this.userRepository.save(admin); // Yangilangan adminni saqlash
    return admin; // O'chirilgan adminni qaytarish
  }
}
