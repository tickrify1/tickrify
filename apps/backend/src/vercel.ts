import serverlessExpress from '@vendia/serverless-express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import express from 'express';

let cachedServer: any;

async function bootstrap() {
  if (!cachedServer) {
    const expressApp = express();
    
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
      {
        rawBody: true,
        logger: ['error', 'warn', 'log'],
      },
    );

    app.enableCors({
      origin: process.env.FRONTEND_URL,
      credentials: true,
    });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

    await app.init();
    cachedServer = serverlessExpress({ app: expressApp });
  }
  return cachedServer;
}

export default async function handler(event: any, context: any) {
  const server = await bootstrap();
  return server(event, context);
}

