import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import axios from 'axios';

@Injectable()
export class AgentiaService {
  constructor(private prisma: PrismaService) {}

  async createAgent(data: {
    name: string;
    description?: string;
    type: string;
    model: string;
    apiKey: string;
    apiUrl: string;
    userId: string;
  }) {
    if (!data.userId) {
      throw new Error('userId manquant lors de la création de l’agent');
    }

    const parsedUrl = new URL(data.apiUrl);
    const baseUrl = `${parsedUrl.protocol}//${parsedUrl.host}`;

    return this.prisma.agent.create({
      data: {
        name: data.name,
        description: data.description,
        type: data.type,
        model: data.model,
        apiKey: data.apiKey,
        apiUrl: baseUrl,
        userId: data.userId,
        status: 'ONLINE',
      },
    });
  }

  async getAllAgents(userId: string) {
    return this.prisma.agent.findMany({ where: { userId } });
  }

  async getAgentById(id: string, userId: string) {
    const agent = await this.prisma.agent.findUnique({ where: { id } });
    if (!agent) throw new NotFoundException('Agent introuvable');
    if (agent.userId !== userId) throw new ForbiddenException();
    return agent;
  }

  async updateAgent(
    id: string,
    data: Partial<{
      name: string;
      description: string;
      model: string;
      type: string;
    }>,
    userId: string,
  ) {
    const agent = await this.prisma.agent.findUnique({ where: { id } });
    if (!agent) throw new NotFoundException('Agent introuvable');
    if (agent.userId !== userId) throw new ForbiddenException();

    return this.prisma.agent.update({
      where: { id },
      data,
    });
  }

  async deleteAgent(id: string, userId: string) {
    const agent = await this.prisma.agent.findUnique({ where: { id } });
    if (!agent) throw new NotFoundException('Agent introuvable');
    if (agent.userId !== userId) throw new ForbiddenException();

    return this.prisma.agent.delete({ where: { id } });
  }

  async testConnection(data: {
    apiKey?: string;
    apiUrl: string;
  }): Promise<{ success: boolean; message?: string }> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (data.apiKey) {
        headers['Authorization'] = `Bearer ${data.apiKey}`;
      }

      const response = await axios.get(data.apiUrl, { headers });

      const hasModels =
        response.status === 200 &&
        response.data &&
        Array.isArray(response.data.data || response.data) &&
        (response.data.data || response.data).length > 0;

      return {
        success: hasModels,
        message: hasModels
          ? 'Connexion réussie - modèles disponibles'
          : 'Réponse valide mais aucun modèle trouvé',
      };
    } catch (error: any) {
      console.error('❌ Erreur lors du test de connexion →', error);

      let msg = 'Erreur inconnue';
      if (axios.isAxiosError(error)) {
        if (error.response) {
          msg = `Erreur API (${error.response.status}) : ${JSON.stringify(error.response.data)}`;
        } else if (error.request) {
          msg = 'Aucune réponse du serveur IA';
        } else {
          msg = `Erreur de configuration : ${error.message}`;
        }
      }

      return { success: false, message: msg };
    }
  }
}
