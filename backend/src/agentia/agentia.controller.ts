import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Patch,
  Delete,
  HttpException,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AgentiaService } from './agentia.service';
import { AuthGuard } from '../auth/auth.guard';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: { id: string };
}

@UseGuards(AuthGuard)
@Controller('agentia')
export class AgentiaController {
  constructor(private readonly agentiaService: AgentiaService) {}

  @Get()
  async getAllAgents(@Req() req: AuthenticatedRequest) {
    return this.agentiaService.getAllAgents(req.user.id);
  }

  @Get(':id')
  async getAgentById(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.agentiaService.getAgentById(id, req.user.id);
  }

  @Patch(':id')
  async updateAgent(
    @Param('id') id: string,
    @Body() body: any,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.agentiaService.updateAgent(id, body, req.user.id);
  }

  @Delete(':id')
  async deleteAgent(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.agentiaService.deleteAgent(id, req.user.id);
  }

  @Post('create')
  async createAgent(@Body() body: any) {
    const { name, type, model, apiUrl, apiKey, description, userId } = body;

    if (!name || !type || !model || !apiUrl || !userId) {
      throw new HttpException('Champs manquants', HttpStatus.BAD_REQUEST);
    }

    try {
      return await this.agentiaService.createAgent({
        name,
        type,
        model,
        apiKey,
        description,
        apiUrl,
        userId,
      });
    } catch (error) {
      console.error('❌ Erreur lors de la création de l’agent →', error);
      throw new HttpException(
        'Erreur serveur',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('test-connection')
  async testConnection(@Body() body: { apiKey?: string; apiUrl: string }) {
    const { apiKey, apiUrl } = body;

    if (!apiUrl) {
      throw new HttpException('apiUrl est requis', HttpStatus.BAD_REQUEST);
    }

    return this.agentiaService.testConnection({ apiKey, apiUrl });
  }
}
