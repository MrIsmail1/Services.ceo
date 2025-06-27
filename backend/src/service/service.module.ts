import { Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ServiceVersionModule } from '../service-version/service-version.module';

@Module({
  imports: [PrismaModule, ServiceVersionModule],
  controllers: [ServiceController],
  providers: [ServiceService],
  exports: [ServiceService],
})
export class ServiceModule {}