import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const PORT = process.env.PORT || 3004;

  const config = new DocumentBuilder()
    .setTitle('Push Notification')
    .setDescription(
      'The API details of the business solution for the Push Notification Demo Application.',
    )
    .setVersion('1.0')
    .addTag('Notification')
    .addBearerAuth()
    .build();

  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalFilters(new AllExceptionsFilter());

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

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
