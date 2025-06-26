import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AgentiaModule } from './agentia/agentia.module';

@Module({
  imports: [PrismaModule, AuthModule, UserModule, AgentiaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
