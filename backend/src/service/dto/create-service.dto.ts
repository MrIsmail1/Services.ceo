import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsUUID, IsArray, IsObject, IsBoolean } from 'class-validator';

export class ServiceInputDto {
    @ApiProperty({
        description: 'Nom du paramètre d\'entrée',
        example: 'texte'
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'Type du paramètre',
        enum: ['text', 'number', 'boolean', 'file'],
        example: 'text'
    })
    @IsString()
    @IsNotEmpty()
    type: 'text' | 'number' | 'boolean' | 'file';

    @ApiPropertyOptional({
        description: 'Description du paramètre'
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional({
        description: 'Si le paramètre est requis',
        default: false
    })
    @IsBoolean()
    @IsOptional()
    required?: boolean;
}

export class ServiceOutputDto {
    @ApiProperty({
        description: 'Nom de la sortie',
        example: 'resultat'
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'Type de la sortie',
        enum: ['text', 'json', 'file'],
        example: 'text'
    })
    @IsString()
    @IsNotEmpty()
    type: 'text' | 'json' | 'file';

    @ApiPropertyOptional({
        description: 'Description de la sortie'
    })
    @IsString()
    @IsOptional()
    description?: string;
}

export class CreateServiceDto {
    @ApiProperty({
        description: 'Nom du service',
        example: 'Service de traduction'
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiPropertyOptional({
        description: 'Description du service'
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional({
        description: 'Catégorie du service',
        example: 'traduction'
    })
    @IsString()
    @IsOptional()
    category?: string;

    @ApiProperty({
        description: 'ID de l\'auteur',
        example: '123e4567-e89b-12d3-a456-426614174001'
    })
    @IsString()
    @IsNotEmpty()
    authorId: string;

    @ApiProperty({
        description: 'Prix du service',
        example: 99.99
    })
    @IsNumber()
    @IsNotEmpty()
    price: number;

    @ApiPropertyOptional({
        description: 'Agent IA à utiliser',
        example: 'gpt-4'
    })
    @IsString()
    @IsOptional()
    agent?: string;

    @ApiPropertyOptional({
        description: 'Modèle IA à utiliser',
        example: 'gpt-4-turbo'
    })
    @IsString()
    @IsOptional()
    model?: string;

    @ApiPropertyOptional({
        description: 'Prompt système pour l\'agent',
        example: 'Tu es un assistant spécialisé dans la traduction...'
    })
    @IsString()
    @IsOptional()
    systemPrompt?: string;

    @ApiPropertyOptional({
        description: 'Prompt utilisateur',
        example: 'Traduis le texte suivant en français...'
    })
    @IsString()
    @IsOptional()
    userPrompt?: string;

    @ApiPropertyOptional({
        description: 'Schéma des entrées',
        type: [ServiceInputDto]
    })
    @IsArray()
    @IsOptional()
    inputs?: ServiceInputDto[];

    @ApiPropertyOptional({
        description: 'Schéma des sorties',
        type: [ServiceOutputDto]
    })
    @IsArray()
    @IsOptional()
    outputs?: ServiceOutputDto[];

    @ApiPropertyOptional({
        description: 'Configuration UI',
        type: 'object',
        additionalProperties: true
    })
    @IsObject()
    @IsOptional()
    uiConfig?: Record<string, any>;

    @ApiPropertyOptional({
        description: 'Règles de validation',
        type: 'object',
        additionalProperties: true
    })
    @IsObject()
    @IsOptional()
    validationRules?: Record<string, any>;
}