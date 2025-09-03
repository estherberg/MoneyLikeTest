import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma.service';

@Controller('creatives')
export class CreativesController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async findAll() {
    return this.prisma.creative.findMany({
      where: { status: 'APPROVED' },
      select: { id: true, title: true, body: true, mediaUrl: true, cta: true },
    });
  }

  @Get('health')
  health() { return { ok: true, service: 'creatives' }; }
}
