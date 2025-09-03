import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { WalletService } from './wallet.service';

 @Controller('wallet')
 export class WalletController {
 constructor(private wallet: WalletService) {}

   @Get('health')
   health() { return { ok: true, service: 'wallet' }; }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: Request & { user: { sub: string } }) {
    const balance = await this.wallet.getBalance(req.user.sub);
    return { balance };
  }
 }
