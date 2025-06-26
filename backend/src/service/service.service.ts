import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';

@Injectable()
export class ServiceService {
    constructor(private prisma: PrismaService) {}

    async create(createServiceDto: CreateServiceDto) {
        const { title, description, category, organizationId, authorId, price } = createServiceDto;

        const serviceConfig = await this.prisma.serviceConfig.create({
            data: {
                inputSchema: {},
                outputSchema: {},
                constraints: {},
                requirements: [],
                systemPrompt: '',
                userPrompt: '',
                metadata: {
                    price,
                    organizationId
                }
            }
        });

        return this.prisma.service.create({
            data: {
                name: title,
                slug: `service-${Date.now()}`,
                description,
                category: category || 'default',
                config: { connect: { id: serviceConfig.id } },
                createdBy: { connect: { id: authorId } }
            },
            include: {
                config: true,
                createdBy: {
                    select: {
                        id: true,
                        email: true
                    }
                }
            }
        });
    }

    async findAll() {
        return this.prisma.service.findMany({
            include: {
                config: true,
                createdBy: {
                    select: {
                        id: true,
                        email: true
                    }
                }
            }
        });
    }

    async findOne(id: string) {
        const service = await this.prisma.service.findUnique({
            where: { id },
            include: { config: true }
        });

        if (!service) {
            throw new NotFoundException('Service non trouvé');
        }

        return service;
    }

    async update(id: string, updateData: any) {
        await this.findOne(id);

        return this.prisma.service.update({
            where: { id },
            data: updateData,
            include: { config: true }
        });
    }

    async remove(id: string) {
        // Vérifier que le service existe
        await this.findOne(id);

        return this.prisma.service.delete({
            where: { id }
        });
    }
}