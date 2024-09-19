import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const PORT = process.env.PORT || 3003;
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  // app.enableCors({
  //   origin: ['http://localhost:3000'],
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  //   allowedHeaders: 'Content-Type, Authorization',
  //   credentials: true,
  // });

  app.enableCors({
    origin: [/^http:\/\/localhost:\d+$/], // Regex to match any localhost port
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });
  await app.listen(PORT);
}
bootstrap();
