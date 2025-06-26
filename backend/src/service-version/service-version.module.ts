import { Global, Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ServiceVersionService } from './service-version.service';

@Global()
@Module({
    imports: [PrismaModule],
    providers: [ServiceVersionService],
    exports: [ServiceVersionService],
})
export class ServiceVersionModule {}