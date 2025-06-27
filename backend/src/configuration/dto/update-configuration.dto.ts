import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsObject, IsString, IsOptional, IsArray } from 'class-validator';

export class UpdateConfigurationDto {
  @ApiPropertyOptional({ description: 'Schéma JSON d\'entrée' })
  @IsObject()
  @IsOptional()
  inputSchema?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Schéma JSON de sortie' })
  @IsObject()
  @IsOptional()
  outputSchema?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Contraintes de validation' })
  @IsObject()
  @IsOptional()
  constraints?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Exigences du service' })
  @IsArray()
  @IsOptional()
  requirements?: string[];

  @ApiPropertyOptional({ description: 'Prompt système pour l\'IA' })
  @IsString()
  @IsOptional()
  systemPrompt?: string;

  @ApiPropertyOptional({ description: 'Prompt utilisateur pour l\'IA' })
  @IsString()
  @IsOptional()
  userPrompt?: string;

  @ApiPropertyOptional({ description: 'Configuration UI' })
  @IsObject()
  @IsOptional()
  uiConfig?: Record<string, any>;
}
