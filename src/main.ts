import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getCorsOrigins, isProduction } from './common/config';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  // CORS: production da faqat CORS_ORIGINS dagi domenlarga ruxsat.
  // Dashboard nginx orqali bir xil domendan (/api) chaqiradi — unga CORS kerak emas.
  const corsOrigins = getCorsOrigins();
  if (corsOrigins.length > 0) {
    app.enableCors({ origin: corsOrigins, credentials: true });
    logger.log(`CORS ruxsat etilgan domenlar: ${corsOrigins.join(', ')}`);
  } else if (isProduction()) {
    app.enableCors({ origin: false });
    logger.warn(
      'CORS_ORIGINS bo‘sh — faqat same-origin so‘rovlar qabul qilinadi',
    );
  } else {
    app.enableCors({ origin: true, credentials: true });
  }

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Production da nginx reverse-proxy orqali ishlaydi, shuning uchun
  // API ni faqat localhost ga bog'lash tavsiya etiladi (HOST=127.0.0.1).
  const port = Number(process.env.PORT) || 3000;
  const host = process.env.HOST || '0.0.0.0';
  await app.listen(port, host);
  logger.log(`To'lqin Math API: http://${host}:${port}/api`);
}
void bootstrap();
