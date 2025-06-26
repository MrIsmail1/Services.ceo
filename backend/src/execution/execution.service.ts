import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService, AiResponse } from '../ai/ai.service';
import { Prisma } from '@prisma/client';
import { ConfigurationService } from '../configuration/configuration.service';
import { LoggingService } from '../logging/logging.service';



@Injectable()
export class ExecutionService {
  constructor(
      private readonly prisma: PrismaService,
      private readonly ai: AiService,
      private readonly configurationService: ConfigurationService,
      private readonly logger: LoggingService,
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

    await this.logger.log(exec.id, 'INFO', 'Execution started');

    const aiReq = await this.configurationService.buildAiRequest(serviceId, input);
    const systemPrompt = aiReq.system;
    const userPrompt = `${aiReq.user}\n\n${JSON.stringify(aiReq.input, null, 2)}`;
    const schema = svc.config.outputSchema as object;

    const aiResp: AiResponse<any> = await this.ai.generate(
        systemPrompt,
        userPrompt,
        schema,
        { stream: false },
    );

    let updateData: Prisma.ExecutionUpdateInput;
    let output: { success: boolean; data: any } | undefined;
    if (aiResp.error == null) {
      output = { success: true, data: aiResp.result! };

      updateData = {
        status: 'COMPLETED',
        output,
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

    await this.logger.log(
        exec.id,
        aiResp.error ? 'ERROR' : 'INFO',
        aiResp.error ? String(aiResp.error) : 'Execution completed',
    );

    if (aiResp.error) {
      throw new InternalServerErrorException(
          `AI error: ${aiResp.error}`,
      );
    }

    return output!;
  }
}
