import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class PromptService {
  constructor(private prisma: PrismaService) {}

  async createPromptConfig(prompt: string, setActive = true) {
    // Buscar última versão
    const lastVersion = await this.prisma.promptConfig.findFirst({
      orderBy: { version: 'desc' },
    });

    const newVersion = (lastVersion?.version || 0) + 1;

    // Se setActive = true, desativar todos os outros prompts
    if (setActive) {
      await this.prisma.promptConfig.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      });
    }

    return this.prisma.promptConfig.create({
      data: {
        version: newVersion,
        prompt,
        isActive: setActive,
      },
    });
  }

  async getLatestPrompt() {
    const prompt = await this.prisma.promptConfig.findFirst({
      where: { isActive: true },
      orderBy: { version: 'desc' },
    });

    if (!prompt) {
      throw new NotFoundException('No active prompt found');
    }

    return prompt;
  }

  async getPromptByVersion(version: number) {
    const prompt = await this.prisma.promptConfig.findUnique({
      where: { version },
    });

    if (!prompt) {
      throw new NotFoundException(`Prompt version ${version} not found`);
    }

    return prompt;
  }

  async listPrompts() {
    return this.prisma.promptConfig.findMany({
      orderBy: { version: 'desc' },
    });
  }

  async activatePrompt(version: number) {
    // Desativar todos
    await this.prisma.promptConfig.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });

    // Ativar o específico
    return this.prisma.promptConfig.update({
      where: { version },
      data: { isActive: true },
    });
  }
}

