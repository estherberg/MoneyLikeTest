import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../shared/prisma.service';
import { CreateInteractionDto, InteractionType } from './dto';

const CREDIT_MAP: Record<InteractionType, number> = {
  CLICK: 1,
  LIKE: 2,
  VOTE: 3,
};

@Injectable()
export class InteractionsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateInteractionDto) {
    console.log("interaction dto", dto, "userId", userId);
    const creative = await this.prisma.creative.findUnique({
      where: { id: dto.creativeId },
      select: { id: true, status: true },
    });
    if (!creative) throw new NotFoundException('Creative not found');
    if (creative.status !== 'APPROVED') throw new ForbiddenException('Creative not approved');

    const creditAmount = CREDIT_MAP[dto.type] ?? 0;

    // CLICK throttle: reject if the same user clicks the same creative within 10 seconds.
    if (dto.type === InteractionType.CLICK) {
      const tenSecAgo = new Date(Date.now() - 10_000);
      const recent = await this.prisma.interaction.findFirst({
        where: { userId, creativeId: dto.creativeId, itype: 'CLICK', ts: { gt: tenSecAgo } },
        select: { id: true },
      });
      if (recent) {
        return { interactionId: recent.id, credited: false, newBalance: null }; //do not credit twice
      }
    }

    try {
      const result = await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
       
        const interaction = await tx.interaction.create({
          data: {
            creativeId: dto.creativeId,
            userId,
            itype: dto.type,
            metadata: dto.metadata ?? {},
          },
          select: { id: true, itype: true },
        });

        let newBalance: number | null = null;
        let credited = false;

        
        if (creditAmount > 0) {
          await tx.wallet.upsert({
            where: { userId },
            update: {},
            create: { userId }, 
          });

          const w = await tx.wallet.update({
            where: { userId },
            data: { balance: { increment: creditAmount } },
            select: { balance: true },
          });
          newBalance = w.balance;
          credited = true;
        }

        return { interactionId: interaction.id, credited, newBalance };
      });

      return result;
    } catch (e: any) {
      if (e?.code === 'P2002') {
        
        const existing = await this.prisma.interaction.findFirst({
          where: { userId, creativeId: dto.creativeId, itype: dto.type },
          select: { id: true },
        });
        return { interactionId: existing?.id ?? null, credited: false, newBalance: null };
      }
      throw new BadRequestException(e?.message || 'Interaction failed');
    }
  }
}
