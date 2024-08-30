import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { env } from 'process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Kuki sozlamalari
  app.use(cookieParser());

  // Validatatsiya sozlamalasi
  app.useGlobalPipes(new ValidationPipe());

  // Swagger sozlamalari
  const config = new DocumentBuilder()
    .setTitle('Author API')
    .setDescription('The author API description')
    .setVersion('1.0')
    .addTag('DevbookUz')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(env.PORT, () => {
    console.warn('Listening on ' + env.PORT);
  });
}
bootstrap();
