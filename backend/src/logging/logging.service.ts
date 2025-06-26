import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LoggingService {
    constructor(private prisma: PrismaService) {}

    async log(
        executionId: string,
        level: string,
        message: string,
        metadata?: Prisma.InputJsonValue,
    ) {
        await this.prisma.log.create({
            data: {
                executionId,
                level,
                message,
                metadata,
            },
        });
    }
}