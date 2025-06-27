import {
    Controller,
    Get,
    Param,
    Put,
    Body,
    NotFoundException
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiBody
} from '@nestjs/swagger';
import { ConfigurationService } from './configuration.service';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';
import { ServiceConfiguration } from './types/configuration.type';

@ApiTags('Configuration')
@Controller('services/:serviceId/configuration')
export class ConfigurationController {
    constructor(private readonly configService: ConfigurationService) {}

    @Get()
    @ApiOperation({ 
        summary: 'Récupérer la configuration d\'un service',
        description: 'Récupère la configuration complète d\'un service par son ID'
    })
    @ApiParam({ 
        name: 'serviceId', 
        description: 'ID unique du service',
        example: '123e4567-e89b-12d3-a456-426614174000' 
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Configuration récupérée avec succès' 
    })
    @ApiResponse({ 
        status: 404, 
        description: 'Service non trouvé' 
    })
    async getConfiguration(@Param('serviceId') serviceId: string) {
        const result = await this.configService.getByServiceId(serviceId);
        if (!result.data) {
            throw new NotFoundException('Configuration non trouvée pour ce service');
        }
        return result;
    }

    @Put()
    @ApiOperation({ 
        summary: 'Mettre à jour la configuration d\'un service',
        description: 'Met à jour tout ou partie de la configuration d\'un service'
    })
    @ApiParam({ 
        name: 'serviceId', 
        description: 'ID unique du service',
        example: '123e4567-e89b-12d3-a456-426614174000' 
    })
    @ApiBody({
        type: UpdateConfigurationDto,
        examples: {
            basic: {
                summary: 'Configuration de base',
                value: {
                    systemPrompt: 'Tu es un assistant IA',
                    userPrompt: 'Réponds à la question suivante: {question}'
                }
            },
            full: {
                summary: 'Configuration complète',
                value: {
                    inputSchema: {
                        type: 'object',
                        properties: {
                            question: { type: 'string' }
                        },
                        required: ['question']
                    },
                    outputSchema: {
                        type: 'object',
                        properties: {
                            answer: { type: 'string' }
                        }
                    },
                    systemPrompt: 'Tu es un assistant IA',
                    userPrompt: 'Réponds à la question suivante: {question}',
                    constraints: {
                        max_length: 1000
                    },
                    requirements: ['réponse précise'],
                    uiConfig: {
                        question: {
                            label: 'Votre question',
                            component: 'textarea'
                        }
                    }
                }
            }
        }
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Configuration mise à jour avec succès' 
    })
    @ApiResponse({ 
        status: 400, 
        description: 'Données de configuration invalides' 
    })
    @ApiResponse({ 
        status: 404, 
        description: 'Service non trouvé' 
    })
    async updateConfiguration(
        @Param('serviceId') serviceId: string,
        @Body() updateData: UpdateConfigurationDto
    ) {
        // Convertir le DTO en format attendu par le service
        const serviceConfig: Partial<Omit<ServiceConfiguration, 'metadata'>> = {
            inputSchema: {
                type: 'object',
                properties: updateData.inputSchema?.properties || {},
                ...updateData.inputSchema
            },
            outputSchema: {
                type: 'object',
                properties: updateData.outputSchema?.properties || {},
                ...updateData.outputSchema
            },
            constraints: Array.isArray(updateData.constraints) ? updateData.constraints : [],
            requirements: Array.isArray(updateData.requirements) ? updateData.requirements : [],
            systemPrompt: updateData.systemPrompt,
            userPrompt: updateData.userPrompt,
            uiConfig: updateData.uiConfig
        };

        const result = await this.configService.update(serviceId, serviceConfig);
        if (!result.data) {
            throw new NotFoundException('Service non trouvé');
        }
        return result;
    }
}