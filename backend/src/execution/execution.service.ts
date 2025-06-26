import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';

@Injectable()
export class ExecutionService {
  constructor(
      private readonly prisma: PrismaService,
      private readonly ai: AiService,
  ) {}

  async run(serviceId: string, input: any): Promise<{ success: boolean; data: any }> {
    const svc = await this.prisma.service.findUnique({
      where: { id: serviceId },
      include: { config: true },
    });
    if (!svc) throw new NotFoundException(`Service ${serviceId} introuvable`);
    if (!svc.config) throw new NotFoundException(`Configuration manquante pour ${serviceId}`);

    const exec = await this.prisma.execution.create({
      data: {
        service: { connect: { id: serviceId } },
        status: 'PENDING',
        input,
        startedAt: new Date(),
      },
    });

    const prompt = this.buildPrompt(svc.config, input);
    const aiResp = await this.ai.generate(prompt, {});

    const updateData =
        aiResp.error == null
            ? { status: 'COMPLETED', output: aiResp.result, completedAt: new Date() }
            : { status: 'FAILED', error: aiResp.error, completedAt: new Date() };

    await this.prisma.execution.update({ where: { id: exec.id }, data: updateData });

    if (aiResp.error) {
      throw new InternalServerErrorException(`AI error: ${aiResp.error}`);
    }
    return { success: true, data: aiResp.result };
  }

  private buildPrompt(
      config: { systemPrompt: string; userPrompt: string },
      input: any,
  ): string {
    return [config.systemPrompt, config.userPrompt, JSON.stringify(input, null, 2)].join('\n\n');
  }
}
