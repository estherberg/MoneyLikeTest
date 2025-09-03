import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Roles } from '../auth/roles.decorator';
import { InteractionsService } from './interactions.service';
import { CreateInteractionDto } from './dto';
import { RolesGuard } from '../auth/roles.guard';

type JwtUser = { sub: string; role: 'USER' | 'ADVERTISER' | 'ADMIN'; email: string };
interface AuthenticatedRequest extends Request { user: JwtUser; }

@UseGuards(JwtAuthGuard, RolesGuard) 
@Controller('interactions')
export class InteractionsController {
  constructor(private readonly svc: InteractionsService) {}

  @Roles('USER')              
  @Post()
  async create(@Req() req: AuthenticatedRequest, @Body() dto: CreateInteractionDto) {
    return this.svc.create(req.user.sub, dto);
  }
}
