import { Injectable } from '@nestjs/common';
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
  }) {
    // Ici on suppose que tu as un modèle `Agent` dans ta base de données (à ajouter si besoin)
    return this.prisma.agent.create({
      data: {
        name: data.name,
        description: data.description,
        type: data.type,
        model: data.model,
        apiKey: data.apiKey,
        status: 'ONLINE',
      },
    });
  }

  async testConnection(apiKey: string): Promise<{ success: boolean }> {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: 'ping' }],
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        },
      );

      if (response.status === 200) {
        return { success: true };
      }

      return { success: false };
    } catch (err) {
      return { success: false };
    }
  }
}
