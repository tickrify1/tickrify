import { Controller, Post, Get, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { PromptService } from './prompt.service';

@Controller('prompts')
export class PromptController {
  constructor(private promptService: PromptService) {}

  @Post('config')
  @UseGuards(AuthGuard) // TODO: Adicionar AdminGuard depois
  async createConfig(@Body() body: { prompt: string; setActive?: boolean }) {
    return this.promptService.createPromptConfig(body.prompt, body.setActive ?? true);
  }

  @Get('latest')
  async getLatest() {
    return this.promptService.getLatestPrompt();
  }

  @Get('list')
  @UseGuards(AuthGuard)
  async listPrompts() {
    return this.promptService.listPrompts();
  }

  @Get(':version')
  async getByVersion(@Param('version', ParseIntPipe) version: number) {
    return this.promptService.getPromptByVersion(version);
  }

  @Post(':version/activate')
  @UseGuards(AuthGuard) // TODO: Adicionar AdminGuard
  async activatePrompt(@Param('version', ParseIntPipe) version: number) {
    return this.promptService.activatePrompt(version);
  }
}

