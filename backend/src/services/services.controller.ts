import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { ServicesService } from './services.service';
import { CreateServiceDto, ServiceStatus } from './dto/create-service.dto';
import { UpdateServiceStatusDto } from './dto/update-service-status.dto';

interface AuthRequest extends Request {
  user: { id: string };
}

@UseGuards(AuthGuard)
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  async getAll(@Req() req: AuthRequest) {
    return this.servicesService.getAll(req.user.id);
  }

  @Post()
  async create(@Req() req: AuthRequest, @Body() dto: CreateServiceDto) {
    return this.servicesService.createService({ ...dto, userId: req.user.id });
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateServiceStatusDto,
    @Req() req: AuthRequest,
  ) {
    return this.servicesService.updateStatus(id, dto.status, req.user.id);
  }

  @Post(':id/execute')
  async execute(
    @Param('id') id: string,
    @Body() body: any,
    @Req() req: AuthRequest,
  ) {
    return this.servicesService.execute(id, body, req.user.id);
  }
}
