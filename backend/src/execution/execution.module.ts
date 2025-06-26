import { Module } from '@nestjs/common';
import { ExecutionService } from './execution.service';
import { ExecutionController } from './execution.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigurationModule } from '../configuration/configuration.module';
import {HttpModule} from "@nestjs/axios";
import {AiService} from "../ai/ai.service";

@Module({
  imports: [PrismaModule, ConfigurationModule, HttpModule],
  providers: [ExecutionService, AiService],
  controllers: [ExecutionController],
})
export class ExecutionModule {}
