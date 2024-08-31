import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { RolesModule } from '../roles/roles.module';
import { Role } from '../roles/entities/role.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtService } from '../jwt/jwt.service';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]),
    CloudinaryModule,
    RolesModule,
    JwtModule.register({}),
    EmailModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtService],
})
export class UsersModule {}
