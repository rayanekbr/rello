import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Add cookie parser middleware
  app.use(cookieParser());
  
  // Configure CORS to allow credentials
  app.enableCors({
    origin: true, // Or your specific frontend URL
    credentials: true,
    allowedHeaders: 'Content-Type,Authorization',
  });
  
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap()