import { Global, Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { LoggingService } from './logging.service';

@Global()
@Module({
    imports: [PrismaModule],
    providers: [LoggingService],
    exports: [LoggingService],
})
export class LoggingModule {}