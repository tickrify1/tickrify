import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

/**
 * Bootstrap function for local development
 * This is used when running the server locally with `npm run dev` or `npm start`
 */
async function bootstrap() {
  try {
    console.log('🚀 Starting NestJS application...');
    
    const app = await NestFactory.create(AppModule, {
      rawBody: true,
      logger: ['error', 'warn', 'log', 'debug'],
    });

    // Configure CORS for local development
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:5176',
      process.env.FRONTEND_URL,
    ].filter(Boolean);

    app.enableCors({
      origin: allowedOrigins,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    });

    // Global validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    // Set global prefix
    app.setGlobalPrefix('api');

    const port = process.env.PORT || 3001;
    await app.listen(port);
    
    console.log(`✅ Backend running on http://localhost:${port}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Allowed origins: ${allowedOrigins.join(', ')}`);
  } catch (error) {
    console.error('❌ Failed to start application:', error);
    process.exit(1);
  }
}

// Only bootstrap if this file is run directly (not imported)
if (require.main === module) {
  bootstrap();
}

