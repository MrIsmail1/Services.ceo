import { IsString, IsArray } from 'class-validator';

export enum ServiceStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  TESTING = 'TESTING',
}

export class CreateServiceDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  category: string;

  @IsString()
  agentId: string;

  @IsString()
  model: string;

  @IsString()
  prompt: string;

  @IsArray()
  inputs: any[];

  @IsArray()
  outputs: any[];
}
