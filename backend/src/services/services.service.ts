import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from 'src/prisma/prisma.service';
import { ServiceStatus } from './dto/create-service.dto';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async createService(data: {
    name: string;
    description: string;
    category: string;
    agentId: string;
    model: string;
    prompt: string;
    inputs: any[];
    outputs: any[];
    userId: string;
  }) {
    return this.prisma.simpleService.create({
      data: {
        name: data.name,
        description: data.description,
        category: data.category,
        agentId: data.agentId,
        model: data.model,
        prompt: data.prompt,
        inputs: data.inputs,
        outputs: data.outputs,
        userId: data.userId,
        status: ServiceStatus.TESTING,
      },
    });
  }

  async getAll(userId: string) {
    return this.prisma.simpleService.findMany({ where: { userId } });
  }

  async updateStatus(id: string, status: ServiceStatus, userId: string) {
    const service = await this.prisma.simpleService.findUnique({ where: { id } });
    if (!service) throw new NotFoundException('Service introuvable');
    if (service.userId !== userId) throw new ForbiddenException();
    return this.prisma.simpleService.update({ where: { id }, data: { status } });
  }

  async execute(id: string, input: any, userId: string) {
    const service = await this.prisma.simpleService.findUnique({
      where: { id },
      include: { agent: true },
    });
    if (!service) throw new NotFoundException('Service introuvable');
    if (service.userId !== userId) throw new ForbiddenException();

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (service.agent.apiKey) {
      headers['Authorization'] = `Bearer ${service.agent.apiKey}`;
    }
    const url = `${service.agent.apiUrl}/v1/chat/completions`;
    const messages = [
      { role: 'system', content: service.prompt },
      { role: 'user', content: JSON.stringify(input) },
    ];
    const response = await axios.post(
      url,
      { model: service.model, messages },
      { headers }
    );
    return response.data;
  }
}
