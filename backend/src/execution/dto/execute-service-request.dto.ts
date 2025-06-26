import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';

export class ExecuteServiceRequestDto {
  @ApiProperty({
    description: 'Objet `input` envoyé au service IA (structure libre)',
    type: 'object',
    additionalProperties: true,
    example: { texte: 'Bonjour', niveau: 'soutenu' },
  })
  @IsObject()
  input: Record<string, any>;
}