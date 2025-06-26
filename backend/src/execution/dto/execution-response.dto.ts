import { ApiProperty } from '@nestjs/swagger';

export class ExecutionResponseDto {
    @ApiProperty({ description: 'Succès de l’exécution', example: true })
    success: boolean;

    @ApiProperty({
        description: 'Résultat renvoyé par l’IA (structure libre)',
        type: 'object',
        additionalProperties: true,
        example: { traduction: 'Hello, how are you?', niveau: 'soutenu' },
    })
    data: Record<string, any>;
}