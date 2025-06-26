import { Module } from '@nestjs/common';
import { AgentiaService } from './agentia.service';
import { AgentiaController } from './agentia.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [AgentiaController],
  providers: [AgentiaService, PrismaService],
})
export class AgentiaModule {}
