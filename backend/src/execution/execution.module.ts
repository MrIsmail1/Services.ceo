import { Module } from '@nestjs/common';
import { ExecutionService } from './execution.service';
import { ExecutionController } from './execution.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigurationModule } from '../configuration/configuration.module';
import {HttpModule} from "@nestjs/axios";
import {AiService} from "../ai/ai.service";
import { LoggingModule } from '../logging/logging.module';
import { WorkflowService } from './workflow.service';

@Module({
  imports: [PrismaModule, ConfigurationModule, HttpModule, LoggingModule],
  providers: [ExecutionService, AiService, WorkflowService],
  controllers: [ExecutionController],
})
export class ExecutionModule {}
