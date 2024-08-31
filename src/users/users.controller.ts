// src/users/users.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { RefreshTokenDto } from './dto/refresh-token.dto'; // RefreshTokenDto import
import { TokenDto } from './dto/token.dto'; // TokenDto import
import { EmailDto } from './dto/email.dto'; // EmailDto import
import { LoginUserDto } from './dto/login-user.dto';

@ApiTags('foydalanuvchilar')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Foydalanuvchini ro'yxatdan o'tkazish
  @Post('register')
  @UseInterceptors(FileInterceptor('photo'))
  @ApiConsumes('multipart/form-data') // Indicate that this endpoint consumes multipart/form-data
  @ApiOperation({ summary: "Yangi foydalanuvchini ro'yxatdan o'tkazish" })
  @ApiBody({
    type: CreateUserDto,
    description: "Foydalanuvchi ro'yxatga olish uchun kerakli ma'lumotlar",
  })
  @ApiResponse({
    status: 201,
    description: "Foydalanuvchi muvaffaqiyatli ro'yxatdan o'tgan.",
  })
  @ApiResponse({ status: 409, description: 'Foydalanuvchi allaqachon mavjud.' })
  @ApiResponse({ status: 400, description: "Noto'g'ri so'rov." })
  async create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() photo: Express.Multer.File,
  ) {
    return this.usersService.register(createUserDto, photo);
  }

  //Login qismi
  @Post('login')
  @ApiConsumes('application/json') // Indicate that this endpoint consumes application/json
  @ApiOperation({ summary: 'Foydalanuvchini kirish' })
  @ApiBody({ type: LoginUserDto }) // LoginUserDto dan foydalanish
  @ApiResponse({
    status: 200,
    description: 'Foydalanuvchi muvaffaqiyatli kirdi.',
  })
  @ApiResponse({
    status: 404,
    description: 'Foydalanuvchi topilmadi yoki parol xato.',
  })
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.login(loginUserDto);
  }

  // Barcha foydalanuvchilarni olish
  @Get()
  @ApiOperation({ summary: 'Barcha foydalanuvchilarni olish' })
  @ApiResponse({
    status: 200,
    description: "Foydalanuvchilar ro'yxati.",
    type: [User],
  })
  async findAll() {
    return this.usersService.findAll();
  }

  // ID bo'yicha foydalanuvchini topish
  @Get(':id')
  @ApiOperation({ summary: "ID bo'yicha foydalanuvchini topish" })
  @ApiResponse({
    status: 200,
    description: 'Foydalanuvchi topildi.',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'Foydalanuvchi topilmadi.' })
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  // ID bo'yicha foydalanuvchini yangilash
  @Patch(':id')
  @UseInterceptors(FileInterceptor('photo'))
  @ApiConsumes('multipart/form-data') // Indicate that this endpoint consumes multipart/form-data
  @ApiOperation({ summary: "ID bo'yicha foydalanuvchini yangilash" })
  @ApiBody({
    type: UpdateUserDto,
    description:
      "Foydalanuvchi ma'lumotlarini yangilash uchun kerakli ma'lumotlar",
  })
  @ApiResponse({
    status: 200,
    description: 'Foydalanuvchi muvaffaqiyatli yangilandi.',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'Foydalanuvchi topilmadi.' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() photo?: Express.Multer.File,
  ) {
    return this.usersService.update(+id, updateUserDto, photo);
  }

  // ID bo'yicha foydalanuvchini o'chirish (deaktivatsiya qilish)
  @Delete(':id')
  @ApiOperation({
    summary: "ID bo'yicha foydalanuvchini o'chirish (deaktivatsiya qilish)",
  })
  @ApiResponse({
    status: 204,
    description: "Foydalanuvchi muvaffaqiyatli o'chirildi.",
  })
  @ApiResponse({ status: 404, description: 'Foydalanuvchi topilmadi.' })
  async remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  // Foydalanuvchini aktivatsiya qilish
  @Post('activate')
  @ApiConsumes('application/json') // Indicate that this endpoint consumes application/json
  @ApiOperation({ summary: 'Foydalanuvchi hisobini aktivatsiya qilish' })
  @ApiBody({ type: TokenDto }) // TokenDto dan foydalanish
  @ApiResponse({
    status: 200,
    description: 'Foydalanuvchi muvaffaqiyatli aktivlashtirildi.',
  })
  @ApiResponse({ status: 404, description: 'Foydalanuvchi topilmadi.' })
  async activateUser(@Body() tokenDto: TokenDto): Promise<void> {
    return this.usersService.activateUser(tokenDto.token);
  }

  // Emailni qaytadan jo'natish
  @Post('resend-activation')
  @ApiConsumes('application/json') // Indicate that this endpoint consumes application/json
  @ApiOperation({ summary: "Aktivatsiya emailini qaytadan jo'natish" })
  @ApiBody({ type: EmailDto }) // EmailDto dan foydalanish
  @ApiResponse({
    status: 200,
    description: "Aktivatsiya emaili muvaffaqiyatli qaytadan jo'natildi.",
  })
  @ApiResponse({ status: 404, description: 'Foydalanuvchi topilmadi.' })
  async resendActivationEmail(@Body() emailDto: EmailDto) {
    return this.usersService.resendActivationEmail(emailDto.email);
  }

  // Refresh tokenni yangilash
  @Post('refresh-token')
  @ApiConsumes('application/json') // Indicate that this endpoint consumes application/json
  @ApiOperation({ summary: 'Foydalanuvchi tokenini yangilash' })
  @ApiBody({ type: RefreshTokenDto }) // RefreshTokenDto dan foydalanish
  @ApiResponse({ status: 200, description: 'Token muvaffaqiyatli yangilandi.' })
  @ApiResponse({ status: 401, description: "Noto'g'ri refresh token." })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.usersService.refreshToken(refreshTokenDto.refreshToken);
  }

  // Logout funksiyasi
  @Post('logout/:id')
  @ApiOperation({ summary: 'Foydalanuvchini logout qilish' })
  @ApiResponse({
    status: 204,
    description: 'Foydalanuvchi muvaffaqiyatli logout qilindi.',
  })
  @ApiResponse({ status: 404, description: 'Foydalanuvchi topilmadi.' })
  async logout(@Param('id') id: string) {
    return this.usersService.logout(+id);
  }
}
