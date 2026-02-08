import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

// BigInt serialization fix
(BigInt.prototype as any).toJSON = function() {
  return this.toString();
};

// Utility function to normalize origin URLs by removing trailing slash
const normalizeOrigin = (origin: string): string => {
  return origin.endsWith('/') ? origin.slice(0, -1) : origin;
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.setGlobalPrefix('api/v1');
  
  // Enable CORS for web and mobile applications
  // Default allowed origins for development (Vite, Create React App, Angular CLI)
  const defaultAllowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173', // Vite default
    'http://localhost:5174', // Vite alternative
    'http://localhost:4200', // Angular CLI default
  ];
  
  // Parse and validate ALLOWED_ORIGINS from environment
  const allowedOrigins = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS
        .split(',')
        .map(origin => origin.trim())
        .filter(origin => {
          try {
            new URL(origin);
            return true;
          } catch {
            console.warn(`Invalid origin in ALLOWED_ORIGINS: ${origin}`);
            return false;
          }
        })
    : defaultAllowedOrigins;
  
  // Normalize allowed origins once during initialization for better performance
  const normalizedAllowedOrigins = allowedOrigins.map(normalizeOrigin);
  
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin) {
        return callback(null, true);
      }
      
      // In development, allow all localhost/127.0.0.1 origins
      // Note: This allows any port for development convenience
      if (isDevelopment) {
        try {
          const url = new URL(origin);
          if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
            return callback(null, true);
          }
        } catch (error) {
          // Invalid URL format, reject it
          return callback(new Error('Invalid origin URL format'));
        }
        // Fall through to check allowedOrigins for non-localhost origins in development
      }
      
      // Normalize and check if origin is in allowed list
      const normalizedOrigin = normalizeOrigin(origin);
      if (normalizedAllowedOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }
      
      // Reject unauthorized origins
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
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
