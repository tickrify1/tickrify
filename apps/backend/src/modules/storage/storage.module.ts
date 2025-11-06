import { Module, Global } from '@nestjs/common';
import { S3Service } from './s3.service';
import { LocalStorageService } from './local.service';

// Use LocalStorageService para desenvolvimento (não precisa de AWS)
// Use S3Service para produção
const USE_LOCAL_STORAGE = process.env.USE_LOCAL_STORAGE !== 'false';

@Global()
@Module({
  providers: [
    USE_LOCAL_STORAGE 
      ? { provide: S3Service, useClass: LocalStorageService }
      : S3Service
  ],
  exports: [S3Service],
})
export class StorageModule {}

