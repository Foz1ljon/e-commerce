import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { JwtService } from '../jwt/jwt.service';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { EmailService } from '../email/email.service';
import { env } from 'process';
import { Role } from '../roles/entities/role.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role) // Inject the Role repository
    private readonly roleRepository: Repository<Role>,
    private jwtService: JwtService,
    private upload: CloudinaryService,
    private emailService: EmailService,
  ) {}

  // Foydalanuvchini login qilish
  async login(login: LoginUserDto) {
    const findUser = await this.userRepository.findOneBy({
      email: login.email,
    });

    if (!findUser) {
      throw new NotFoundException('Email topilmadi yoki parol xato');
    }

    const isMatch = await bcrypt.compare(login.password, findUser.password);
    if (!isMatch) {
      throw new NotFoundException('Email topilmadi yoki parol xato');
    }

    // Tokenlarni generatsiya qilish
    const tokens = this.jwtService.generateTokens(findUser);

    // Refresh tokenni hash qilish va saqlash
    findUser.refreshtoken = await bcrypt.hash(tokens.refreshToken, 10);
    await this.userRepository.save(findUser);

    // Access va refresh tokenlarni qaytarish
    return tokens;
  }

  // Yangi foydalanuvchini ro'yxatdan o'tkazish
  async register(createUserDto: CreateUserDto, photo: Express.Multer.File) {
    const findUser = await this.userRepository.findOne({
      where: [
        { email: createUserDto.email },
        { phone_number: createUserDto.phone_number },
      ],
    });

    if (findUser) {
      throw new ConflictException(
        "Bu foydalanuvchi allaqachon ro'yxatdan o'tgan",
      );
    }

    // Rasm yuklash va uni URL sifatida saqlash
    if (photo) {
      const img = await this.upload.uploadImage(photo);
      createUserDto.photo = img.secure_url;
    }

    // Parolni hash qilish
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    createUserDto.password = hashedPassword;

    // Yangi foydalanuvchini yaratish
    const newUser = this.userRepository.create(createUserDto);
    await this.userRepository.save(newUser);

    // Tokenlarni generatsiya qilish
    const tokens = this.jwtService.generateTokens(newUser);

    // Refresh tokenni hash qilish va saqlash
    newUser.refreshtoken = await bcrypt.hash(tokens.refreshToken, 10);
    await this.userRepository.save(newUser);

    return {
      message:
        'Roʻyxatdan oʻtganingizdan soʻng emailga aktivatsiya havolasi yuborildi',
      userId: newUser.id, // Foydalanuvchi ID sini qaytarish
      ...tokens,
    };
  }

  // Foydalanuvchini aktivatsiya qilish
  async activateUser(token: string): Promise<void> {
    const payload = this.jwtService.verifyActivationToken(token); // Tokenni tekshirish va payload olish
    const user = await this.userRepository.findOneBy({ id: payload.sub }); // Foydalanuvchini topish

    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }

    user.active = true; // Foydalanuvchini aktiv holatga o'tkazish

    // USER rolini olish yoki yaratish
    const userRole = await this.roleRepository.findOne({
      where: { name: 'USER' },
    });
    if (userRole) {
      user.role = userRole; // Foydalanuvchiga "USER" rolini berish
    } else {
      throw new NotFoundException('USER roli topilmadi'); // Agar rol mavjud bo'lmasa
    }

    await this.userRepository.save(user); // O'zgartirilgan foydalanuvchini saqlash
  }

  // Emailni qaytadan jo'natish
  async resendActivationEmail(email: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ email }); // Foydalanuvchini topish

    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }

    if (user.active) {
      throw new ConflictException('Foydalanuvchi allaqachon aktiv');
    }

    // Aktivatsiya tokenini generatsiya qilish
    const token = this.jwtService.generateActivationToken(user);
    const activationLink = `${env.active_link}${token}`; // Aktivatsiya havolasi

    // Aktivatsiya emailini jo'natish
    await this.emailService.sendMail(
      user.email,
      'Hisobingizni aktivatsiya qiling',
      'activation', // Templat fayli nomi (shablon)
      { activationLink }, // Kontekst
    );
  }

  // Refresh tokenni yangilash
  async refreshToken(refreshToken: string) {
    const payload = this.jwtService.verifyRefreshToken(refreshToken);
    const user = await this.userRepository.findOneBy({ id: payload.sub });

    if (!user || !user.refreshtoken) {
      throw new UnauthorizedException('Noto‘g‘ri refresh token');
    }

    const isMatch = await bcrypt.compare(refreshToken, user.refreshtoken);
    if (!isMatch) {
      throw new UnauthorizedException('Noto‘g‘ri refresh token');
    }

    // Yangi tokenlarni generatsiya qilish
    const tokens = this.jwtService.generateTokens(user);

    // Yangi refresh tokenni hash qilish va saqlash
    user.refreshtoken = await bcrypt.hash(tokens.refreshToken, 10);
    await this.userRepository.save(user);

    return tokens;
  }

  // Logout funksiyasi
  async logout(userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`Foydalanuvchi topilmadi`);
    }

    user.refreshtoken = null; // Refresh tokenni o'chirish
    await this.userRepository.save(user);
  }

  // Barcha foydalanuvchilarni olish
  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  // ID bo'yicha bitta foydalanuvchini topish
  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`Foydalanuvchi #${id} topilmadi`);
    }
    return user;
  }

  // ID bo'yicha foydalanuvchini yangilash
  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    photo?: Express.Multer.File,
  ): Promise<User> {
    const user = await this.findOne(id); // Foydalanuvchini topish

    // Agar rasm yuklanayotgan bo'lsa, yangilash
    if (photo) {
      const img = await this.upload.uploadImage(photo);
      updateUserDto.photo = img.secure_url;
    }

    const updatedUser = Object.assign(user, updateUserDto); // Foydalanuvchini yangilash
    return await this.userRepository.save(updatedUser); // Yangilangan foydalanuvchini saqlash
  }

  // ID bo'yicha foydalanuvchini o'chirish (deaktivatsiya qilish)
  async remove(id: number): Promise<void> {
    const user = await this.findOne(id); // Foydalanuvchini topish

    // Foydalanuvchini deaktivatsiya qilish
    user.active = false;

    // O'zgartirilgan foydalanuvchini saqlash
    await this.userRepository.save(user);
  }
}
