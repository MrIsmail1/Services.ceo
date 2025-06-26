import { Module } from '@nestjs/common';
import { AgentiaService } from './agentia.service';
import { AgentiaController } from './agentia.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [AgentiaController],
  providers: [AgentiaService, PrismaService],
})
export class AgentiaModule {}
