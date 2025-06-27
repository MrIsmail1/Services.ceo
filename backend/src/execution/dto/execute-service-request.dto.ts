import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString } from 'class-validator';

export class ExecuteServiceRequestDto {
  @ApiProperty({
    description: 'Objet `input` envoyé au service IA (structure libre)',
    type: 'object',
    additionalProperties: true,
    example: { texte: 'Bonjour', niveau: 'soutenu' },
  })
  @IsObject()
  input: Record<string, any>;

  @ApiPropertyOptional({
    description: 'ID de l\'exécution en cours (pour workflow step-by-step)',
    example: 'a1b2c3d4-5678-90ab-cdef-1234567890ab',
  })
  @IsString()
  @IsOptional()
  executionId?: string;

  @ApiPropertyOptional({
    description: 'Provider IA à utiliser (lama ou mistral)',
    example: 'mistral',
  })
  @IsString()
  @IsOptional()
  provider?: 'lama' | 'mistral';
}