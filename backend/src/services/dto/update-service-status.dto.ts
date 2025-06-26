import { IsEnum } from 'class-validator';
import { ServiceStatus } from './create-service.dto';

export class UpdateServiceStatusDto {
  @IsEnum(ServiceStatus)
  status: ServiceStatus;
}
