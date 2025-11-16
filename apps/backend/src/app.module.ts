import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { DatabaseModule } from './modules/database/database.module';
import { StorageModule } from './modules/storage/storage.module';
import { AuthModule } from './modules/auth/auth.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { AiModule } from './modules/ai/ai.module';
import { PromptModule } from './modules/prompt/prompt.module';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true,
      envFilePath: '.env',
    }),
    MulterModule.register({
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    }),
    DatabaseModule,
    StorageModule,
    AuthModule,
    PaymentsModule,
    AiModule,
    PromptModule,
  ],
})
export class AppModule {
  // O prefixo global 'api' é configurado no main.ts e vercel.ts
}

