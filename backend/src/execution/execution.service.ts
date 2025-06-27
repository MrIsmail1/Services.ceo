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
import { WorkflowService } from './workflow.service';

@Injectable()
export class ExecutionService {
  constructor(
      private readonly prisma: PrismaService,
      private readonly ai: AiService,
      private readonly configurationService: ConfigurationService,
      private readonly logger: LoggingService,
      private readonly workflowService: WorkflowService,
  ) {}

  async run(
      serviceId: string,
      input: any,
      provider?: 'lama' | 'mistral',
  ): Promise<{ success: boolean; data: any; workflow?: any }> {
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
    
    // Utiliser les prompts de la configuration du service
    const systemPrompt = aiReq.system || svc.config.systemPrompt || `Tu es un assistant IA spécialisé dans le traitement de texte.

RÈGLES IMPORTANTES :
1. Tu dois toujours être utile et fournir des réponses précises
2. Si tu estimes ne pas avoir assez de contexte pour répondre, tu DOIS poser des questions pour clarifier
3. Sois interactif et guide l'utilisateur vers une réponse complète
4. Explique clairement ce que tu peux faire et ce dont tu as besoin
5. Ne donne jamais de réponses vagues ou génériques`;

    const userPrompt = aiReq.user || svc.config.userPrompt || `Traite les données suivantes et fournis un résultat utile.

Si les informations fournies ne sont pas suffisantes pour répondre de manière précise, pose des questions pour clarifier :
- Quel est le contexte spécifique ?
- Quel type de résultat est attendu ?
- Y a-t-il des contraintes ou préférences particulières ?

Données à traiter : {input}`;

    this.logger.log(exec.id, 'INFO', 'Provider IA utilisé : ' + (provider || 'lama'));

    try {
      // Exécuter le workflow
      const workflowResponse = await this.workflowService.executeWorkflow(
        serviceId,
        svc.name,
        input,
        systemPrompt,
        userPrompt,
        provider
      );

      let updateData: Prisma.ExecutionUpdateInput;
      let output: { success: boolean; data: any; workflow?: any } | undefined;

      if (workflowResponse.success) {
        output = { 
          success: true, 
          data: workflowResponse.data,
          workflow: workflowResponse.workflow
        };

        // Sérialiser les données pour Prisma
        const serializedOutput = {
          success: true,
          data: workflowResponse.data,
          workflow: JSON.stringify(workflowResponse.workflow) // Sérialiser le workflow
        };

        updateData = {
          status: 'COMPLETED',
          output: serializedOutput,
          completedAt: new Date(),
        };
      } else {
        updateData = {
          status: 'FAILED',
          error: workflowResponse.error,
          completedAt: new Date(),
        };
      }

      await this.prisma.execution.update({
        where: { id: exec.id },
        data: updateData,
      });

      await this.logger.log(
          exec.id,
          workflowResponse.success ? 'INFO' : 'ERROR',
          workflowResponse.success ? 'Execution completed with workflow' : String(workflowResponse.error),
      );

      if (!workflowResponse.success) {
        throw new InternalServerErrorException(
            `Workflow error: ${workflowResponse.error}`,
        );
      }

      return output!;

    } catch (error) {
      await this.prisma.execution.update({
        where: { id: exec.id },
        data: {
          status: 'FAILED',
          error: error.message,
          completedAt: new Date(),
        },
      });

      await this.logger.log(exec.id, 'ERROR', String(error));

      throw new InternalServerErrorException(
          `Execution error: ${error.message}`,
      );
    }
  }
}
