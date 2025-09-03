import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma.service';

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService) {}

  async credit(userId: string, amount: number) {
    if (!userId) throw new BadRequestException('userId required');
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new BadRequestException('amount must be > 0');
    }
    return this.prisma.wallet.upsert({
      where: { userId },
      update: { balance: { increment: amount } },
      create: { userId, balance: amount },
    });
  }

  async getBalance(userId: string) {
    const w = await this.prisma.wallet.findUnique({ where: { userId } });
    return w?.balance ?? 0;
  }

  async debit(userId: string, amount: number) {
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new BadRequestException('amount must be > 0');
    }
    return this.prisma.wallet.update({
      where: { userId },
      data: { balance: { decrement: amount } },
    });
  }
}
