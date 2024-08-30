import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { JwtService } from '../jwt/jwt.service';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';

@Injectable()
export class UserService {
  private readonly bcryptSaltRounds = 10; // Recommended salt rounds for bcrypt

  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly fileUpload: CloudinaryService,
    private readonly jwtService: JwtService,
  ) {}

  // Register user
  async create(
    createUserDto: CreateUserDto,
    photo: Express.Multer.File,
    res: Response,
  ) {
    // Check if the email already exists
    const existingUser = await this.userRepo.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new ConflictException("Bu email avval ro'yxatdan o'tgan!");
    }

    // Validate photo
    if (!photo) {
      throw new BadRequestException('Rasm kiritish majburiy!');
    }

    // Upload photo and get URL
    const photoUrl = await this.fileUpload.uploadImage(photo);
    createUserDto.photo = photoUrl.url;

    // Hash passwords
    createUserDto.password = await bcrypt.hash(
      createUserDto.password,
      this.bcryptSaltRounds,
    );
    createUserDto.refresh_token = await bcrypt.hash(
      createUserDto.refresh_token,
      this.bcryptSaltRounds,
    );

    // Create and save the user
    const newUser = this.userRepo.create(createUserDto);
    await this.userRepo.save(newUser);

    // Generate tokens
    const tokens = this.jwtService.generateTokens(newUser);

    // Set refresh token cookie
    res.cookie('refresh_token', tokens.refreshToken, {
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
      httpOnly: true,
    });

    return {
      message: "Foydalanuvchi muvaffaqiyatli ro'yxatdan o'tdi!",
      ...tokens,
    };
  }

  // Login user
  async login(loginUserDto: LoginUserDto, res: Response) {
    // Find user by email
    const user = await this.userRepo.findOne({
      where: { email: loginUserDto.email },
    });
    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi!');
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(loginUserDto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Notoʻgʻri parol!');
    }

    // Generate tokens
    const tokens = this.jwtService.generateTokens(user);

    // Set refresh token cookie
    res.cookie('refresh_token', tokens.refreshToken, {
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
      httpOnly: true,
    });

    // Set access token cookie
    res.cookie('access_token', tokens.accessToken, {
      maxAge: 1 * 60 * 60 * 1000, // 1 hour
      httpOnly: true,
    });

    return {
      message: 'Foydalanuvchi muvaffaqiyatli tizimga kirdi!',
      ...tokens,
    };
  }

  // Placeholder methods
  findAll() {
    return 'This action returns all users';
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  // Forgot password
  updatePassword(email: string) {
    // Implement forgot password logic
    return `Password update logic for ${email} needs to be implemented.`;
  }

  update(
    id: number,
    updateUserDto: UpdateUserDto,
    photo?: Express.Multer.File,
  ) {
    // Implement update user logice
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    // Implement user removal logic
    return `This action removes a #${id} user`;
  }
}
