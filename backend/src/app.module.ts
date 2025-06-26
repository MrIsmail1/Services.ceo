import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigurationController } from './configuration/configuration.controller';
import { ConfigurationModule } from './configuration/configuration.module';
import { ExecutionModule } from './execution/execution.module';
import { PrismaModule } from './prisma/prisma.module';
import { ServiceModule } from './service/service.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    PrismaModule,
    ServiceModule,
    ConfigurationModule,
    ExecutionModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController, ConfigurationController],
  providers: [AppService],
})
export class AppModule {}
