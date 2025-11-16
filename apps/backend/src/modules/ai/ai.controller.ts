import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../../common/decorators/user.decorator';
import { AiService } from './ai.service';
import { PrismaService } from '../database/prisma.service';
import { UploadedFile as UploadedFileType } from '../../common/interfaces/multer';

@Controller('ai')
export class AiController {
  constructor(
    private aiService: AiService,
    private prisma: PrismaService,
  ) {}

  @Post('analyze')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async analyze(
    @CurrentUser() user: { clerkUserId: string },
    @UploadedFile() file: UploadedFileType,
    @Body('base64Image') base64Image?: string,
    @Body('promptOverride') promptOverride?: string,
  ) {
    try {
      console.log('[AiController] analyze endpoint called', { 
        clerkUserId: user.clerkUserId,
        hasFile: !!file,
        hasBase64: !!base64Image 
      });

      // Buscar ou criar usuário no banco de dados
      let dbUser = await this.prisma.user.findUnique({
        where: { clerkUserId: user.clerkUserId },
      });

      if (!dbUser) {
        console.log('[AiController] User not found, creating new user:', user.clerkUserId);
        dbUser = await this.prisma.user.create({
          data: {
            clerkUserId: user.clerkUserId,
            email: user.clerkUserId + '@temp.com', // Email temporário
          },
        });
        console.log('[AiController] New user created:', dbUser.id);
      } else {
        console.log('[AiController] DB User found:', dbUser.id);
      }

      const result = await this.aiService.createAnalysis(
        dbUser.id,
        file,
        base64Image,
        promptOverride,
      );

      console.log('[AiController] Analysis created successfully:', result.id);
      return result;
    } catch (error) {
      console.error('[AiController] Error in analyze endpoint:', error);
      throw error;
    }
  }

  @Get('analysis/:id')
  @UseGuards(AuthGuard)
  async getAnalysis(
    @CurrentUser() user: { clerkUserId: string },
    @Param('id') id: string,
  ) {
    const dbUser = await this.prisma.user.findUnique({
      where: { clerkUserId: user.clerkUserId },
    });

    return this.aiService.getAnalysis(id, dbUser!.id);
  }

  @Get('analyses')
  @UseGuards(AuthGuard)
  async listAnalyses(
    @CurrentUser() user: { clerkUserId: string },
    @Query('limit') limit?: string,
  ) {
    const dbUser = await this.prisma.user.findUnique({
      where: { clerkUserId: user.clerkUserId },
    });

    return this.aiService.listAnalyses(dbUser!.id, limit ? parseInt(limit) : 20);
  }
}

