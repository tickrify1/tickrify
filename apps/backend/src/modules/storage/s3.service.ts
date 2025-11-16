import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { UploadedFile } from '../../common/interfaces/multer';

@Injectable()
export class S3Service {
  private s3Client: S3Client;
  private bucket: string;

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
    this.bucket = process.env.S3_BUCKET!;
  }

  async uploadImage(file: UploadedFile, userId: string): Promise<string> {
    const key = `analyses/${userId}/${uuidv4()}-${file.originalname}`;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3Client.send(command);

    // Retorna URL pública (ajuste conforme configuração do seu bucket)
    return `https://${this.bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  }

  async uploadBase64Image(base64Data: string, userId: string): Promise<string> {
    // Remove o prefixo data:image/xxx;base64,
    const matches = base64Data.match(/^data:(.+);base64,(.+)$/);
    if (!matches) {
      throw new Error('Invalid base64 image data');
    }

    const contentType = matches[1];
    const buffer = Buffer.from(matches[2], 'base64');
    const extension = contentType.split('/')[1];
    const key = `analyses/${userId}/${uuidv4()}.${extension}`;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    });

    await this.s3Client.send(command);

    return `https://${this.bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  }
}

