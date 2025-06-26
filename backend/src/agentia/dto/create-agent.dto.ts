import { IsString } from 'class-validator';

export class CreateAgentDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  type: string;

  @IsString()
  model: string;

  @IsString()
  apiKey: string;
}
