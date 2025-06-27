import { Module } from '@nestjs/common';
import { ConfigurationService } from './configuration.service';
import { ConfigurationController } from './configuration.controller';
import { ServiceVersionModule } from '../service-version/service-version.module';


@Module({
  imports: [ServiceVersionModule],
  providers: [ConfigurationService],
  controllers: [ConfigurationController],
  exports: [ConfigurationService]
})
export class ConfigurationModule {}
