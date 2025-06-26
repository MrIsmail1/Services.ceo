import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AgentiaService } from './agentia.service';

@Controller('agentia')
export class AgentiaController {
  constructor(private readonly agentiaService: AgentiaService) {}

  @Post('create')
  async createAgent(@Body() body: any) {
    const { name, description, type, model, apiKey } = body;

    if (!name || !type || !model || !apiKey) {
      throw new HttpException('Champs manquants', HttpStatus.BAD_REQUEST);
    }

    return this.agentiaService.createAgent(body);
  }

  @Post('test-connection')
  async testConnection(@Body('apiKey') apiKey: string) {
    if (!apiKey) {
      throw new HttpException('Clé API manquante', HttpStatus.BAD_REQUEST);
    }

    return this.agentiaService.testConnection(apiKey);
  }
}
