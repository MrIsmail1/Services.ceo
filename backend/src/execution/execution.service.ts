import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService, AiResponse } from '../ai/ai.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ExecutionService {
  constructor(
      private readonly prisma: PrismaService,
      private readonly ai: AiService,
  ) {}


  async run(
      serviceId: string,
      input: any,
  ): Promise<{ success: boolean; data: any }> {
    // 1) Charger le service + sa config
    const svc = await this.prisma.service.findUnique({
      where: { id: serviceId },
      include: { config: true },
    });
    if (!svc) {
      throw new NotFoundException(`Service ${serviceId} introuvable`);
    }
    if (!svc.config) {
      throw new NotFoundException(
          `Configuration manquante pour ${serviceId}`,
      );
    }

    const exec = await this.prisma.execution.create({
      data: {
        service: { connect: { id: serviceId } },
        status: 'PENDING',
        input,
        startedAt: new Date(),
      },
    });

    const systemPrompt = svc.config.systemPrompt;
    const userPrompt = `${svc.config.userPrompt}\n\n${JSON.stringify(
        input,
        null,
        2,
    )}`;
    const schema = svc.config.outputSchema as object;

    const aiResp: AiResponse<any> = await this.ai.generate(
        systemPrompt,
        userPrompt,
        schema,
        { stream: false },
    );

    let updateData: Prisma.ExecutionUpdateInput;
    if (aiResp.error == null) {
      updateData = {
        status: 'COMPLETED',
        output: aiResp.result!,
        completedAt: new Date(),
      };
    } else {
      updateData = {
        status: 'FAILED',
        error: aiResp.error,
        completedAt: new Date(),
      };
    }

    await this.prisma.execution.update({
      where: { id: exec.id },
      data: updateData,
    });

    if (aiResp.error) {
      throw new InternalServerErrorException(
          `AI error: ${aiResp.error}`,
      );
    }

    return { success: true, data: aiResp.result };
  }
}
