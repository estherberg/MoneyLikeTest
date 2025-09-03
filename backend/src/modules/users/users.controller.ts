import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { PrismaService } from '../../shared/prisma.service';
import type { Request } from 'express';

type JwtUser = { sub: string; email: string; role: 'USER' | 'ADVERTISER' | 'ADMIN' };

@Controller('users')
export class UsersController {
  constructor(private prisma: PrismaService) {}

  @Get('health')
  health() { return { ok: true, service: 'users' }; }

  @UseGuards(JwtAuthGuard)
@Get('me')
async getMe(@Req() req: Request & { user: JwtUser }) {
  return this.prisma.user.findUnique({
    where: { id: req.user.sub },
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
      wallet: true,
    },
  });
}
}
