import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

// BigInt serialization fix
(BigInt.prototype as any).toJSON = function() {
  return this.toString();
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.setGlobalPrefix('api/v1');
  
  // Enable CORS for web and mobile applications
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, postman, etc.)
      if (!origin) {
        return callback(null, true);
      }
      
      // Allow localhost origins for development
      const allowedOrigins = [
        'http://localhost:8080',
        'http://localhost:3000',
        'http://localhost:3001',
        'http://127.0.0.1:8080',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:3001',
      ];
      
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      
      // Allow all other origins (for mobile apps and production)
      return callback(null, true);
    },
    credentials: true,
  });
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap();
