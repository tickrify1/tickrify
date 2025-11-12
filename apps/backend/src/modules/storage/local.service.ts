import { Injectable } from '@nestjs/common';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { existsSync } from 'fs';

@Injectable()
export class LocalStorageService {
  private uploadDir: string;

  constructor() {
    // Em ambientes serverless (como Vercel), apenas /tmp é gravável
    const isServerless = !!process.env.VERCEL || process.env.NODE_ENV === 'production';
    this.uploadDir = isServerless ? '/tmp/uploads' : join(process.cwd(), 'uploads');
    this.ensureUploadDirExists();
  }

  private async ensureUploadDirExists() {
    if (!existsSync(this.uploadDir)) {
      await mkdir(this.uploadDir, { recursive: true });
    }
  }

  async uploadImage(file: Express.Multer.File, userId: string): Promise<string> {
    await this.ensureUploadDirExists();

    const filename = `${uuidv4()}-${file.originalname}`;
    const filepath = join(this.uploadDir, filename);

    await writeFile(filepath, file.buffer);

    // Converter para base64 data URL para OpenAI
    const base64 = file.buffer.toString('base64');
    const mimeType = file.mimetype || 'image/png';
    return `data:${mimeType};base64,${base64}`;
  }

  async uploadBase64Image(base64Data: string, userId: string): Promise<string> {
    await this.ensureUploadDirExists();

    // Remove o prefixo data:image/xxx;base64,
    const matches = base64Data.match(/^data:(.+);base64,(.+)$/);
    if (!matches) {
      throw new Error('Invalid base64 image data');
    }

    const contentType = matches[1];
    const buffer = Buffer.from(matches[2], 'base64');
    const extension = contentType.split('/')[1] || 'png';
    const filename = `${uuidv4()}.${extension}`;
    const filepath = join(this.uploadDir, filename);

    await writeFile(filepath, buffer);

    // Retorna base64 data URL diretamente para o OpenAI
    return base64Data;
  }
}

