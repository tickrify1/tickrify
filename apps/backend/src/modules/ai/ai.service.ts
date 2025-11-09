import { Injectable, BadRequestException, ServiceUnavailableException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { S3Service } from '../storage/s3.service';
import { getAiQueue } from './ai.queue';

@Injectable()
export class AiService {
  constructor(
    private prisma: PrismaService,
    private s3Service: S3Service,
  ) {}

  async createAnalysis(
    userId: string,
    imageFile?: Express.Multer.File,
    base64Image?: string,
    promptOverride?: string,
  ) {
    try {
      console.log('[AiService] createAnalysis called', { 
        userId, 
        hasFile: !!imageFile, 
        hasBase64: !!base64Image 
      });

      // Upload da imagem para S3 (ou storage local)
      let imageUrl: string;

      if (imageFile) {
        console.log('[AiService] Uploading file...', imageFile.originalname);
        imageUrl = await this.s3Service.uploadImage(imageFile, userId);
        console.log('[AiService] File uploaded:', imageUrl);
      } else if (base64Image) {
        console.log('[AiService] Uploading base64 image...');
        imageUrl = await this.s3Service.uploadBase64Image(base64Image, userId);
        console.log('[AiService] Base64 uploaded');
      } else {
        throw new BadRequestException('No image provided');
      }

      // Buscar versão mais recente do prompt (se não tiver override)
      let promptVersion: number | undefined;
      if (!promptOverride) {
        const latestPrompt = await this.prisma.promptConfig.findFirst({
          where: { isActive: true },
          orderBy: { version: 'desc' },
        });
        promptVersion = latestPrompt?.version;
        console.log('[AiService] Using prompt version:', promptVersion);
      }

      // Criar registro de análise com status "pending"
      console.log('[AiService] Creating analysis record...');
      const analysis = await this.prisma.analysis.create({
        data: {
          userId,
          imageUrl,
          status: 'pending',
          promptVer: promptVersion,
        },
      });
      console.log('[AiService] Analysis created:', analysis.id);

      // Enfileirar job para processamento
      console.log('[AiService] Adding job to queue...');
      const queue = getAiQueue();
      
      if (!queue) {
        // In serverless without Redis, mark as failed
        await this.prisma.analysis.update({
          where: { id: analysis.id },
          data: { 
            status: 'error',
            reasoning: 'Queue service not available in serverless environment. Please configure Redis or use a dedicated worker service.'
          }
        });
        throw new ServiceUnavailableException(
          'Analysis queue not available. Please contact support or try again later.'
        );
      }
      
      await queue.add('process-analysis', {
        analysisId: analysis.id,
        imageUrl,
        promptOverride,
        promptVersion,
      });
      console.log('[AiService] Job added to queue');

      return {
        id: analysis.id,
        status: 'pending',
        imageUrl,
        createdAt: analysis.createdAt,
        updatedAt: analysis.updatedAt,
      };
    } catch (error) {
      console.error('[AiService] Error in createAnalysis:', error);
      throw error;
    }
  }

  async getAnalysis(id: string, userId: string) {
    const analysis = await this.prisma.analysis.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!analysis) {
      throw new BadRequestException('Analysis not found');
    }

    return {
      id: analysis.id,
      imageUrl: analysis.imageUrl,
      status: analysis.status,
      recommendation: analysis.recommendation,
      confidence: analysis.confidence,
      reasoning: analysis.reasoning,
      fullResponse: analysis.fullResponse,
      createdAt: analysis.createdAt,
      updatedAt: analysis.updatedAt,
    };
  }

  async listAnalyses(userId: string, limit = 20) {
    const analyses = await this.prisma.analysis.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return analyses.map((a) => ({
      id: a.id,
      imageUrl: a.imageUrl,
      status: a.status,
      recommendation: a.recommendation,
      confidence: a.confidence,
      createdAt: a.createdAt,
    }));
  }
}

