import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './exception.filter';

async function bootstrap() {
  const PORT = process.env.PORT || 3003;
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalFilters(new AllExceptionsFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      errorHttpStatusCode: 422,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.enableCors({
    origin: [/^http:\/\/localhost:\d+$/],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });
  await app.listen(PORT);
}
bootstrap();
