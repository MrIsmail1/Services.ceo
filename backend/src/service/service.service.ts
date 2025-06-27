import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { Prisma } from '@prisma/client';
import { ServiceVersionService } from '../service-version/service-version.service';

@Injectable()
export class ServiceService {
    constructor(
        private prisma: PrismaService,
        private versioning: ServiceVersionService,
    ) {}

    async create(createServiceDto: CreateServiceDto) {
        const { 
            name, 
            description, 
            category, 
            authorId, 
            price,
            agent,
            model,
            systemPrompt,
            userPrompt,
            inputs,
            outputs,
            uiConfig,
            validationRules
        } = createServiceDto;

        // Prompts par défaut si non fournis
        const defaultSystemPrompt = systemPrompt || `Tu es un assistant IA spécialisé dans ${description || 'le traitement de données'}. 

RÈGLES IMPORTANTES :
1. Tu dois toujours être utile et fournir des réponses précises
2. Si tu estimes ne pas avoir assez de contexte pour répondre, tu DOIS poser des questions pour clarifier
3. Sois interactif et guide l'utilisateur vers une réponse complète
4. Explique clairement ce que tu peux faire et ce dont tu as besoin
5. Ne donne jamais de réponses vagues ou génériques`;

        const defaultUserPrompt = userPrompt || `Traite les données suivantes et fournis un résultat utile.

Si les informations fournies ne sont pas suffisantes pour répondre de manière précise, pose des questions pour clarifier :
- Quel est le contexte spécifique ?
- Quel type de résultat est attendu ?
- Y a-t-il des contraintes ou préférences particulières ?

Données à traiter : {input}`;

        const serviceConfig = await this.prisma.serviceConfig.create({
            data: {
                inputSchema: inputs ? (inputs as unknown as Prisma.InputJsonValue) : [],
                outputSchema: outputs ? (outputs as unknown as Prisma.InputJsonValue) : [],
                constraints: validationRules || {},
                requirements: [],
                systemPrompt: defaultSystemPrompt,
                userPrompt: defaultUserPrompt,
                uiConfig: uiConfig || {},
                metadata: { 
                    price,
                    agent,
                    model
                },
            },
        });

        return this.prisma.service.create({
            data: {
                name,
                slug: this.generateSlug(name),
                description,
                category: category || 'default',
                configId: serviceConfig.id,
                createdById: authorId,
            }
        });
    }

    private generateSlug(name: string): string {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim()
            + '-' + Date.now();
    }

    async findAll(category?: string) {
        const where: Prisma.ServiceWhereInput = {};
        if (category) (where as any).category = category;
        return this.prisma.service.findMany({
            where,
            include: {},
        });
    }

    async findOne(id: string) {
        const service = await this.prisma.service.findUnique({
            where: { id },
            include: {},
        });
        if (!service) throw new NotFoundException('Service non trouvé');
        return service;
    }

    async update(id: string, updateData: any) {
        await this.findOne(id);
        const updated = await this.prisma.service.update({
            where: { id },
            data: updateData,
            include: { config: true },
        });
        await this.versioning.createSnapshot(id);
        return updated;
    }

    async remove(id: string) {
        await this.findOne(id);
        return this.prisma.service.delete({ where: { id } });
    }

    async fixServiceConfigs() {
        console.log('🔧 Vérification et correction des configurations de services...');

        // Récupérer tous les services sans configuration
        const servicesWithoutConfig = await this.prisma.service.findMany({
            where: {
                configId: null
            },
            include: {
                config: true
            }
        });

        console.log(`📊 ${servicesWithoutConfig.length} services sans configuration trouvés`);

        for (const service of servicesWithoutConfig) {
            console.log(`\n🔧 Traitement du service: ${service.name} (${service.id})`);

            // Créer une configuration par défaut
            const defaultSystemPrompt = `Tu es un assistant IA spécialisé dans ${service.description || 'le traitement de données'}. 

RÈGLES IMPORTANTES :
1. Tu dois toujours être utile et fournir des réponses précises
2. Si tu estimes ne pas avoir assez de contexte pour répondre, tu DOIS poser des questions pour clarifier
3. Sois interactif et guide l'utilisateur vers une réponse complète
4. Explique clairement ce que tu peux faire et ce dont tu as besoin
5. Ne donne jamais de réponses vagues ou génériques`;

            const defaultUserPrompt = `Traite les données suivantes et fournis un résultat utile.

Si les informations fournies ne sont pas suffisantes pour répondre de manière précise, pose des questions pour clarifier :
- Quel est le contexte spécifique ?
- Quel type de résultat est attendu ?
- Y a-t-il des contraintes ou préférences particulières ?

Données à traiter : {input}`;

            const config = await this.prisma.serviceConfig.create({
                data: {
                    inputSchema: { type: 'object', properties: {} } as Prisma.InputJsonValue,
                    outputSchema: { type: 'object', properties: {} } as Prisma.InputJsonValue,
                    constraints: {} as Prisma.InputJsonValue,
                    requirements: [] as Prisma.InputJsonValue,
                    systemPrompt: defaultSystemPrompt,
                    userPrompt: defaultUserPrompt,
                    uiConfig: {} as Prisma.InputJsonValue,
                    metadata: {
                        version: '1.0.0',
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        createdBy: service.createdById
                    } as Prisma.InputJsonValue
                }
            });

            // Associer la configuration au service
            await this.prisma.service.update({
                where: { id: service.id },
                data: { configId: config.id }
            });

            console.log(`✅ Configuration créée et associée au service ${service.name}`);
        }

        // Vérifier les configurations existantes
        const servicesWithConfig = await this.prisma.service.findMany({
            where: {
                configId: { not: null }
            },
            include: {
                config: true
            }
        });

        console.log(`\n📊 ${servicesWithConfig.length} services avec configuration:`);
        
        for (const service of servicesWithConfig) {
            const config = service.config;
            console.log(`\n📋 Service: ${service.name}`);
            console.log(`   - System Prompt: ${config?.systemPrompt ? '✅' : '❌'} ${config?.systemPrompt?.substring(0, 50)}...`);
            console.log(`   - User Prompt: ${config?.userPrompt ? '✅' : '❌'} ${config?.userPrompt?.substring(0, 50)}...`);
            
            // Si les prompts sont vides, les mettre à jour
            if (!config?.systemPrompt || !config?.userPrompt) {
                const defaultSystemPrompt = config?.systemPrompt || `Tu es un assistant IA spécialisé dans ${service.description || 'le traitement de données'}. 

RÈGLES IMPORTANTES :
1. Tu dois toujours être utile et fournir des réponses précises
2. Si tu estimes ne pas avoir assez de contexte pour répondre, tu DOIS poser des questions pour clarifier
3. Sois interactif et guide l'utilisateur vers une réponse complète
4. Explique clairement ce que tu peux faire et ce dont tu as besoin
5. Ne donne jamais de réponses vagues ou génériques`;

                const defaultUserPrompt = config?.userPrompt || `Traite les données suivantes et fournis un résultat utile.

Si les informations fournies ne sont pas suffisantes pour répondre de manière précise, pose des questions pour clarifier :
- Quel est le contexte spécifique ?
- Quel type de résultat est attendu ?
- Y a-t-il des contraintes ou préférences particulières ?

Données à traiter : {input}`;

                await this.prisma.serviceConfig.update({
                    where: { id: config!.id },
                    data: {
                        systemPrompt: defaultSystemPrompt,
                        userPrompt: defaultUserPrompt
                    }
                });

                console.log(`   🔧 Prompts mis à jour`);
            }
        }

        return {
            message: 'Configurations corrigées',
            servicesWithoutConfig: servicesWithoutConfig.length,
            servicesWithConfig: servicesWithConfig.length
        };
    }
}
