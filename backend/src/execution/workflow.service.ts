import { Injectable, NotFoundException } from '@nestjs/common';
import { AiService } from '../ai/ai.service';
import { 
  WorkflowExecution, 
  WorkflowStep, 
  WorkflowResponse, 
  WorkflowStepResult 
} from './types/workflow.types';
import { ConfigurationService } from '../configuration/configuration.service';

@Injectable()
export class WorkflowService {
  constructor(
    private readonly ai: AiService,
    private readonly configurationService: ConfigurationService
  ) {}

  async executeWorkflow(
    serviceId: string,
    serviceName: string,
    input: any,
    systemPrompt: string,
    userPrompt: string,
    provider?: 'lama' | 'mistral'
  ): Promise<WorkflowResponse> {
    const workflowId = `workflow_${Date.now()}`;
    
    // On commence avec une seule étape : validation
    const steps: WorkflowStep[] = [
      {
        id: 'input-validation',
        name: 'Validation des entrées',
        description: 'Vérification et collecte des informations nécessaires',
        status: 'pending'
      }
    ];

    const workflow: WorkflowExecution = {
      id: workflowId,
      steps,
      currentStepIndex: 0,
      status: 'running',
      input
    };

    try {
      // Étape 1: Validation stricte basée sur inputSchema
      const validationResult = await this.executeStep(workflow, 0, async () => {
        // Charger la config du service
        const { data: config } = await this.configurationService.getByServiceId(serviceId);
        if (!config) throw new NotFoundException('Configuration du service introuvable');
        const inputSchema = config.inputSchema;
        const requiredFields: string[] = inputSchema.required || [];
        const properties = inputSchema.properties || {};

        // Champs manquants
        const missingFields = requiredFields.filter(
          (key) => input[key] === undefined || input[key] === null || input[key] === ''
        );

        if (missingFields.length > 0) {
          // Générer les questions à partir de la config
          const questions = missingFields.map((key) => {
            const prop = properties[key] || {};
            const label = prop.title || prop.label || key;
            const desc = prop.description ? ` (${prop.description})` : '';
            return `Merci de renseigner : ${label}${desc}`;
          });

          const interactiveMessage = `🔍 **Validation des entrées**\n\nIl manque des informations pour exécuter la tâche.\n\n**Informations manquantes :**\n${missingFields.map(f => `• ${f}`).join('\n')}\n\n**Questions pour clarifier :**\n${questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}\n\nMerci de compléter les champs manquants pour continuer.`;

          workflow.status = 'waiting_for_input';
          workflow.finalResult = interactiveMessage;

          // On ne retourne que l'étape de validation
          workflow.steps = workflow.steps.slice(0, 1);
          return interactiveMessage;
        }

        return `✅ **Validation réussie**\n\nToutes les informations requises sont présentes.\n\n**Prochaine étape :** Planification.`;
      });

      if (workflow.status === 'waiting_for_input') {
        // Générer les questions à partir de la config pour l'UI
        const configResponse = await this.configurationService.getByServiceId(serviceId);
        const config = configResponse.data;
        if (!config) throw new NotFoundException('Configuration du service introuvable');
        const inputSchema = config.inputSchema;
        const requiredFields: string[] = inputSchema.required || [];
        const properties = inputSchema.properties || {};
        const missingFields = requiredFields.filter(
          (key) => input[key] === undefined || input[key] === null || input[key] === ''
        );
        const questions = missingFields.map((key) => {
          const prop = properties[key] || {};
          const label = prop.title || prop.label || key;
          const desc = prop.description ? ` (${prop.description})` : '';
          return `Merci de renseigner : ${label}${desc}`;
        });
        // On ne retourne que l'étape de validation
        workflow.steps = workflow.steps.slice(0, 1);
        return {
          success: true,
          workflow,
          data: {
            result: workflow.finalResult,
            requiresMoreInput: true,
            missingInfo: missingFields,
            questions
          }
        };
      }

      // Si la validation est OK, on ajoute les étapes suivantes au workflow
      const planningStep: WorkflowStep = {
        id: 'planning',
        name: 'Planification',
        description: 'Élaboration du plan d\'exécution',
        status: 'pending'
      };
      const processingStep: WorkflowStep = {
        id: 'processing',
        name: 'Traitement',
        description: 'Exécution du traitement principal',
        status: 'pending'
      };
      const finalizationStep: WorkflowStep = {
        id: 'finalization',
        name: 'Finalisation',
        description: 'Préparation du résultat final',
        status: 'pending'
      };
      workflow.steps.push(planningStep, processingStep, finalizationStep);

      // Étape 2: Planification
      await this.executeStep(workflow, 1, async () => {
        const planningPrompt = `Tu es un expert en planification de tâches.\n\nTÂCHE: Créer un plan détaillé pour exécuter "${serviceName}".\n\nCONTEXTE: ${JSON.stringify(input, null, 2)}\n\nINSTRUCTIONS:\n1. Analyse la tâche à accomplir\n2. Décompose-la en sous-étapes logiques\n3. Identifie les ressources et méthodes nécessaires\n4. Crée un plan d'exécution clair\n\nRéponds au format JSON:\n{\n  "plan": ["étape 1", "étape 2", "étape 3"],\n  "methodology": "méthode d'exécution",\n  "estimatedTime": "estimation du temps",\n  "risks": ["risques potentiels"]\n}`;

        const schema = {
          type: "object",
          properties: {
            plan: { type: "array", items: { type: "string" } },
            methodology: { type: "string" },
            estimatedTime: { type: "string" },
            risks: { type: "array", items: { type: "string" } }
          },
          required: ["plan", "methodology", "estimatedTime", "risks"]
        };

        const response = await this.ai.generate(
          systemPrompt,
          planningPrompt,
          schema,
          { stream: false, provider }
        );

        if (response.error) {
          throw new Error(`Erreur de planification: ${response.error}`);
        }

        const planning = response.result;
        
        return `📋 **Plan créé**\n\n${planning.plan.map((step, i) => `${i + 1}. ${step}`).join('\n')}\n\n**Méthode :** ${planning.methodology}\n**Temps estimé :** ${planning.estimatedTime}`;
      });

      // Étape 3: Traitement principal
      await this.executeStep(workflow, 2, async () => {
        const processingPrompt = `Tu es maintenant en phase d'exécution de la tâche "${serviceName}".\n\nEXÉCUTE la tâche en utilisant les entrées fournies et le plan établi.\n\nENTRÉES: ${JSON.stringify(input, null, 2)}\n\nINSTRUCTIONS:\n1. Applique la méthodologie définie\n2. Traite les données selon les spécifications\n3. Assure-toi de la qualité du résultat\n4. Documente le processus d'exécution\n\nRéponds au format JSON:\n{\n  "result": "résultat principal de l'exécution",\n  "details": "détails du processus",\n  "quality": "évaluation de la qualité",\n  "notes": "notes importantes"\n}`;

        const schema = {
          type: "object",
          properties: {
            result: { type: "string" },
            details: { type: "string" },
            quality: { type: "string" },
            notes: { type: "string" }
          },
          required: ["result", "details", "quality", "notes"]
        };

        const response = await this.ai.generate(
          systemPrompt,
          processingPrompt,
          schema,
          { stream: false, provider }
        );

        if (response.error) {
          throw new Error(`Erreur de traitement: ${response.error}`);
        }

        const processing = response.result;
        
        return `⚙️ **Traitement terminé**\n\n**Résultat :** ${processing.result}\n\n**Détails :** ${processing.details}\n**Qualité :** ${processing.quality}`;
      });

      // Étape 4: Finalisation
      await this.executeStep(workflow, 3, async () => {
        const finalizationPrompt = `Tu es en phase de finalisation de la tâche "${serviceName}".\n\nFINALISE le résultat en le formatant de manière professionnelle et utilisable.\n\nRÉSULTAT BRUT: ${workflow.steps[2].result}\n\nINSTRUCTIONS:\n1. Formate le résultat final\n2. Ajoute des explications si nécessaire\n3. Vérifie la cohérence\n4. Prépare la livraison\n\nRéponds au format JSON:\n{\n  "finalResult": "résultat final formaté",\n  "summary": "résumé de l'exécution",\n  "recommendations": ["recommandations"],\n  "nextSteps": "prochaines étapes suggérées"\n}`;

        const schema = {
          type: "object",
          properties: {
            finalResult: { type: "string" },
            summary: { type: "string" },
            recommendations: { type: "array", items: { type: "string" } },
            nextSteps: { type: "string" }
          },
          required: ["finalResult", "summary", "recommendations", "nextSteps"]
        };

        const response = await this.ai.generate(
          systemPrompt,
          finalizationPrompt,
          schema,
          { stream: false }
        );

        if (response.error) {
          throw new Error(`Erreur de finalisation: ${response.error}`);
        }

        const finalization = response.result;
        
        workflow.finalResult = finalization.finalResult;
        
        return `✅ **Finalisation terminée**\n\n**Résultat final :** ${finalization.finalResult}\n\n**Résumé :** ${finalization.summary}`;
      });

      workflow.status = 'completed';
      
      return {
        success: true,
        workflow,
        data: { result: workflow.finalResult }
      };

    } catch (error) {
      workflow.status = 'failed';
      workflow.error = error.message;
      
      return {
        success: false,
        workflow,
        error: error.message
      };
    }
  }

  private async executeStep(
    workflow: WorkflowExecution, 
    stepIndex: number, 
    stepFunction: () => Promise<string>
  ): Promise<string> {
    const step = workflow.steps[stepIndex];
    
    try {
      step.status = 'running';
      step.startTime = new Date();
      workflow.currentStepIndex = stepIndex;

      const result = await stepFunction();
      
      step.status = 'completed';
      step.result = result;
      step.endTime = new Date();
      
      return result;
      
    } catch (error) {
      step.status = 'failed';
      step.error = error.message;
      step.endTime = new Date();
      throw error;
    }
  }
} 