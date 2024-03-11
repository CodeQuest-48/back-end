import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //HABILITAR LAS CORS
  app.enableCors();

  //Agregar un prefijo para todas las rutas
  app.setGlobalPrefix('api');

  //DTOS para validar los datos que no esten
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  //Agregar el process.env.PORT para facilitar la producción
  await app.listen(process.env.PORT || 8000);
}
bootstrap();
