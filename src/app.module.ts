import { env } from 'process';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from './jwt/jwt.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { EmailModule } from './email/email.module';
import { RedisModule } from './redis/redis.module';
import { UsersModule } from './users/users.module';
import { AdminModule } from './admin/admin.module';
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: env.PG_HOST,
      port: +env.PG_PORT,
      username: env.PG_USER,
      password: env.PG_PASSWORD,
      database: 'devbook',
      entities: [__dirname + '/**/*.entity.{js,ts}'],
      synchronize: true, // Use only in development
      logging: false,
    }),
    JwtModule,
    CloudinaryModule,
    EmailModule,
    RedisModule,
    UsersModule,
    AdminModule,
    RolesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
