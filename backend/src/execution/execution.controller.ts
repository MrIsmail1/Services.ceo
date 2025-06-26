import {
  Controller,
  Post,
  Body,
  Param,
  HttpCode,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { ExecutionService } from './execution.service';
import { ExecuteServiceRequestDto } from './dto/execute-service-request.dto';
import { ExecutionResponseDto } from './dto/execution-response.dto';

@ApiTags('Execution')
@Controller('services/:serviceId/execute')
export class ExecutionController {
  constructor(private readonly executionService: ExecutionService) {}

  @Post()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Exécuter un service IA',
    description: 'Envoie un `input` au service et renvoie le résultat de l’IA.',
  })
  @ApiParam({
    name: 'serviceId',
    description: 'UUID du service à exécuter',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({
    type: ExecuteServiceRequestDto,
    description: 'Payload avec la propriété `input`',
    examples: {
      translation: {
        summary: 'Traduction',
        value: { input: { texte: 'Bonjour', niveau: 'soutenu' } },
      },
      qa: {
        summary: 'Q&A',
        value: { input: { question: 'Capitale de la France ?' } },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Exécution réussie',
    type: ExecutionResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Requête invalide' })
  @ApiResponse({ status: 404, description: 'Service ou config introuvable' })
  @ApiResponse({ status: 500, description: 'Erreur interne ou IA' })
  async execute(
      @Param('serviceId', ParseUUIDPipe) serviceId: string,
      @Body() dto: ExecuteServiceRequestDto,
  ): Promise<ExecutionResponseDto> {
    return this.executionService.run(serviceId, dto.input);
  }
}
