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
  // Default allowed origins for development (Vite, Create React App, Angular CLI, React)
 
  
  app.enableCors({
  origin: "*",               // barcha originlarga ruxsat
  methods: ['GET','POST','PUT','DELETE','PATCH','OPTIONS'], // barcha request turlari
  // allowedHeaders: ['*'],     // barcha headerlar ruxsat
  // credentials: true          // agar cookie / session ishlatmoqchi bo‘lsang, true
});

  
  app.useGlobalPipes(
    new ValidationPipe({
      // whitelist: true,
      transform: true,
    }),
  );
  
  const port = process.env.PORT || 3000;
  await app.listen(port, "0.0.0.0");
  console.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap();
