import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ServiceVersionService {
    constructor(private prisma: PrismaService) {}

    async createSnapshot(serviceId: string, notes = '') {
        const service = await this.prisma.service.findUnique({
            where: { id: serviceId },
            include: { config: true },
        });

        if (!service || !service.config) {
            throw new NotFoundException('Service not found');
        }

        const last = await this.prisma.serviceVersion.findFirst({
            where: { serviceId },
            orderBy: { version: 'desc' },
        });
        const nextVersion = (last?.version || 0) + 1;

        const { id: _id, ...config } = service.config as any;

        await this.prisma.serviceVersion.create({
            data: {
                service: { connect: { id: serviceId } },
                version: nextVersion,
                config: config as Prisma.InputJsonValue,
                notes,
                publishedBy: { connect: { id: service.createdById } },
            },
        });
    }
}